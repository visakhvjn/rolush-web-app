import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Client } = pg;

const localPrefix = "/uploads/";
const dryRun = process.argv.includes("--dry-run");

dotenv.config({ path: ".env.local" });
dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getLocalPath(imageUrl) {
  return path.join(process.cwd(), "public", imageUrl);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function uploadLocalImage(imageUrl, folder) {
  const absolutePath = getLocalPath(imageUrl);
  const exists = await fileExists(absolutePath);
  if (!exists) {
    throw new Error(`Missing local file: ${absolutePath}`);
  }

  const uploaded = await cloudinary.uploader.upload(absolutePath, {
    folder,
    resource_type: "image",
    use_filename: false,
    unique_filename: true,
    overwrite: false,
  });

  if (!uploaded.secure_url) {
    throw new Error(`Cloudinary upload returned empty secure_url for ${imageUrl}`);
  }
  return uploaded.secure_url;
}

async function getOrUploadImageUrl({
  imageUrl,
  cloudinaryFolder,
  uploadedUrlByLocalUrl,
}) {
  const cached = uploadedUrlByLocalUrl.get(imageUrl);
  if (cached) return cached;

  const secureUrl = await uploadLocalImage(imageUrl, cloudinaryFolder);
  uploadedUrlByLocalUrl.set(imageUrl, secureUrl);
  return secureUrl;
}

async function migrateTable({
  client,
  table,
  idColumn,
  imageColumn,
  cloudinaryFolder,
  uploadedUrlByLocalUrl,
}) {
  const result = await client.query(
    `select ${idColumn} as id, ${imageColumn} as image_url from ${table} where ${imageColumn} like $1`,
    [`${localPrefix}%`],
  );

  if (result.rows.length === 0) {
    console.log(`[${table}] no local uploads found`);
    return { scanned: 0, migrated: 0, failed: 0 };
  }

  let migrated = 0;
  let failed = 0;
  console.log(`[${table}] found ${result.rows.length} rows`);

  for (const row of result.rows) {
    const id = row.id;
    const imageUrl = row.image_url;
    if (!imageUrl || !imageUrl.startsWith(localPrefix)) continue;

    try {
      if (dryRun) {
        console.log(`[dry-run][${table}] ${id} would migrate ${imageUrl}`);
      } else {
        const secureUrl = await getOrUploadImageUrl({
          imageUrl,
          cloudinaryFolder,
          uploadedUrlByLocalUrl,
        });
        await client.query(
          `update ${table} set ${imageColumn} = $1 where ${idColumn} = $2`,
          [secureUrl, id],
        );
        console.log(`[${table}] migrated ${id} (${imageUrl} -> ${secureUrl})`);
      }
      migrated += 1;
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${table}] failed ${id}: ${message}`);
    }
  }

  return { scanned: result.rows.length, migrated, failed };
}

async function main() {
  const databaseUrl = requireEnv("DATABASE_URL");
  if (!dryRun) {
    const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME");
    const apiKey = requireEnv("CLOUDINARY_API_KEY");
    const apiSecret = requireEnv("CLOUDINARY_API_SECRET");

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const plans = [
      {
        table: "categories",
        idColumn: "id",
        imageColumn: "image_url",
        cloudinaryFolder: "rolush/categories",
      },
      {
        table: "item_images",
        idColumn: "id",
        imageColumn: "image_url",
        cloudinaryFolder: "rolush/items",
      },
      {
        table: "orders",
        idColumn: "id",
        imageColumn: "image_url",
        cloudinaryFolder: "rolush/orders",
      },
    ];

    const uploadedUrlByLocalUrl = new Map();
    const summary = [];
    for (const plan of plans) {
      // Run table by table to keep migration logs understandable and resumable.
      const result = await migrateTable({
        client,
        ...plan,
        uploadedUrlByLocalUrl,
      });
      summary.push({ table: plan.table, ...result });
    }

    console.log("\nMigration summary:");
    for (const row of summary) {
      console.log(
        `- ${row.table}: scanned=${row.scanned} migrated=${row.migrated} failed=${row.failed}`,
      );
    }

    if (dryRun) {
      console.log("\nDry run only. No database rows were updated.");
    } else {
      console.log(`\nUnique files uploaded: ${uploadedUrlByLocalUrl.size}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
