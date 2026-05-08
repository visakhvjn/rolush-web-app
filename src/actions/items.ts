"use server";

import { auth } from "@/auth";
import { getDb } from "@/db";
import { cloudinary } from "@/lib/cloudinary";
import {
  categories,
  itemImages,
  items,
  orders,
  type ItemRow,
} from "@/db/schema";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

const itemSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.string().uuid(),
  price: z.string().min(1).max(80),
  discountedPrice: z.string().max(80).optional(),
  description: z.string().max(2000).optional(),
});
const optionsSchema = z.array(z.string().trim().min(1).max(80)).max(30);

const MAX_IMAGE_COUNT = 12;
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type CreateItemState = {
  ok: boolean;
};

export type UpdateItemState = {
  ok: boolean;
};

const updateItemSchema = itemSchema.extend({
  id: z.string().uuid(),
});

export type ItemWithImages = ItemRow & {
  images: string[];
};

let featuredColumnSupported: boolean | null = null;
let customizationColumnsSupported: boolean | null = null;

async function hasFeaturedColumn() {
  // Cache positive detection; if absent, keep re-checking so runtime can recover
  // immediately after a migration without requiring a server restart.
  if (featuredColumnSupported === true) return true;

  const db = getDb();
  const result = await db.execute(
    sql`select exists (
      select 1
      from information_schema.columns
      where table_name = 'items' and column_name = 'is_featured'
    ) as value`,
  );

  const row = result.rows[0] as { value?: boolean | "t" | "f" } | undefined;
  featuredColumnSupported = row?.value === true || row?.value === "t";
  return featuredColumnSupported;
}

async function hasCustomizationColumns() {
  if (customizationColumnsSupported === true) return true;

  const db = getDb();
  const result = await db.execute(
    sql`select exists (
      select 1
      from information_schema.columns
      where table_name = 'items' and column_name = 'cake_weights'
    ) as value`,
  );

  const row = result.rows[0] as { value?: boolean | "t" | "f" } | undefined;
  customizationColumnsSupported = row?.value === true || row?.value === "t";
  return customizationColumnsSupported;
}

function parseOptionsJson(raw: FormDataEntryValue | null): string | null {
  if (!raw) return null;
  const asString = raw.toString();
  if (!asString) return null;
  try {
    const parsed = JSON.parse(asString);
    const normalized = optionsSchema.safeParse(parsed);
    if (!normalized.success || normalized.data.length === 0) return null;
    return JSON.stringify(normalized.data);
  } catch {
    return null;
  }
}

function normalizeOptionField(value: string | null | undefined): string | null {
  return value ?? null;
}

function pickRandomSubset<T>(source: readonly T[], min: number, max: number): T[] {
  const size = Math.max(min, Math.min(max, source.length));
  const count = Math.floor(Math.random() * (size - min + 1)) + min;
  const shuffled = [...source];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function extFromImageType(type: string): string | undefined {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return undefined;
}

async function saveUploadedImages(files: File[]): Promise<string[]> {
  const validFiles = files.filter((file) => file.size > 0);
  if (validFiles.length === 0) return [];
  if (validFiles.length > MAX_IMAGE_COUNT) return [];

  const savedUrls: string[] = [];
  for (const file of validFiles) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) return [];
    if (file.size > MAX_IMAGE_SIZE_BYTES) return [];

    const ext = extFromImageType(file.type);
    if (!ext) return [];

    const bytes = Buffer.from(await file.arrayBuffer());
    const publicId = `${randomUUID()}.${ext}`;

    const uploaded = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "rolush/items",
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result ?? {});
        },
      );

      stream.end(bytes);
    });

    if (!uploaded.secure_url) return [];
    savedUrls.push(uploaded.secure_url);
  }

  return savedUrls;
}

export async function listItems(): Promise<ItemRow[]> {
  await requireAdmin();
  const db = getDb();
  if (await hasFeaturedColumn()) {
    return db.select().from(items).orderBy(desc(items.createdAt));
  }

  const rows = await db
    .select({
      id: items.id,
      createdAt: items.createdAt,
      name: items.name,
      category: items.category,
      price: items.price,
      discountedPrice: items.discountedPrice,
      isActive: items.isActive,
      description: items.description,
      ...(await hasCustomizationColumns()
        ? {
            cakeWeights: items.cakeWeights,
            cakeShapes: items.cakeShapes,
            cakeTiers: items.cakeTiers,
            cakeAddons: items.cakeAddons,
          }
        : {}),
    })
    .from(items)
    .orderBy(desc(items.createdAt));
  return rows.map((row) => ({
    ...row,
    isFeatured: false,
    cakeWeights: normalizeOptionField((row as { cakeWeights?: string | null }).cakeWeights),
    cakeShapes: normalizeOptionField((row as { cakeShapes?: string | null }).cakeShapes),
    cakeTiers: normalizeOptionField((row as { cakeTiers?: string | null }).cakeTiers),
    cakeAddons: normalizeOptionField((row as { cakeAddons?: string | null }).cakeAddons),
  }));
}

export async function listActiveItems(): Promise<ItemWithImages[]> {
  const db = getDb();
  const itemRows = await (await hasFeaturedColumn()
    ? db.select().from(items).where(eq(items.isActive, true)).orderBy(desc(items.createdAt))
    : db
        .select({
          id: items.id,
          createdAt: items.createdAt,
          name: items.name,
          category: items.category,
          price: items.price,
          discountedPrice: items.discountedPrice,
          isActive: items.isActive,
          description: items.description,
          ...(await hasCustomizationColumns()
            ? {
                cakeWeights: items.cakeWeights,
                cakeShapes: items.cakeShapes,
                cakeTiers: items.cakeTiers,
                cakeAddons: items.cakeAddons,
              }
            : {}),
        })
        .from(items)
        .where(eq(items.isActive, true))
        .orderBy(desc(items.createdAt)));

  if (itemRows.length === 0) return [];

  const imageRows = await db
    .select()
    .from(itemImages)
    .where(inArray(itemImages.itemId, itemRows.map((row) => row.id)))
    .orderBy(asc(itemImages.sortOrder), asc(itemImages.createdAt));

  const imagesByItemId = new Map<string, string[]>();
  for (const image of imageRows) {
    const list = imagesByItemId.get(image.itemId) ?? [];
    list.push(image.imageUrl);
    imagesByItemId.set(image.itemId, list);
  }

  return itemRows.map((item) => ({
    ...item,
    isFeatured: "isFeatured" in item ? item.isFeatured : false,
    cakeWeights: normalizeOptionField((item as { cakeWeights?: string | null }).cakeWeights),
    cakeShapes: normalizeOptionField((item as { cakeShapes?: string | null }).cakeShapes),
    cakeTiers: normalizeOptionField((item as { cakeTiers?: string | null }).cakeTiers),
    cakeAddons: normalizeOptionField((item as { cakeAddons?: string | null }).cakeAddons),
    images: imagesByItemId.get(item.id) ?? [],
  }));
}

export async function listFeaturedItems(): Promise<ItemWithImages[]> {
  if (!(await hasFeaturedColumn())) return [];

  const db = getDb();
  const itemRows = await db
    .select()
    .from(items)
    .where(and(eq(items.isActive, true), eq(items.isFeatured, true)))
    .orderBy(desc(items.createdAt));

  if (itemRows.length === 0) return [];

  const imageRows = await db
    .select()
    .from(itemImages)
    .where(inArray(itemImages.itemId, itemRows.map((row) => row.id)))
    .orderBy(asc(itemImages.sortOrder), asc(itemImages.createdAt));

  const imagesByItemId = new Map<string, string[]>();
  for (const image of imageRows) {
    const list = imagesByItemId.get(image.itemId) ?? [];
    list.push(image.imageUrl);
    imagesByItemId.set(image.itemId, list);
  }

  return itemRows.map((item) => ({
    ...item,
    images: imagesByItemId.get(item.id) ?? [],
  }));
}

export async function getActiveItemById(
  id: string,
): Promise<ItemWithImages | undefined> {
  const db = getDb();
  const rows = await (await hasFeaturedColumn()
    ? db
        .select()
        .from(items)
        .where(and(eq(items.id, id), eq(items.isActive, true)))
        .limit(1)
    : db
        .select({
          id: items.id,
          createdAt: items.createdAt,
          name: items.name,
          category: items.category,
          price: items.price,
          discountedPrice: items.discountedPrice,
          isActive: items.isActive,
          description: items.description,
        })
        .from(items)
        .where(and(eq(items.id, id), eq(items.isActive, true)))
        .limit(1));

  const item = rows[0];
  if (!item) return undefined;

  const imageRows = await db
    .select()
    .from(itemImages)
    .where(eq(itemImages.itemId, item.id))
    .orderBy(asc(itemImages.sortOrder), asc(itemImages.createdAt));

  return {
    ...item,
    isFeatured: "isFeatured" in item ? item.isFeatured : false,
    cakeWeights: normalizeOptionField((item as { cakeWeights?: string | null }).cakeWeights),
    cakeShapes: normalizeOptionField((item as { cakeShapes?: string | null }).cakeShapes),
    cakeTiers: normalizeOptionField((item as { cakeTiers?: string | null }).cakeTiers),
    cakeAddons: normalizeOptionField((item as { cakeAddons?: string | null }).cakeAddons),
    images: imageRows.map((image) => image.imageUrl),
  };
}

export async function createItem(formData: FormData): Promise<CreateItemState> {
  await requireAdmin();
  const parsed = itemSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    discountedPrice: formData.get("discountedPrice")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
  });
  if (!parsed.success) return { ok: false };

  const db = getDb();
  const [categoryRow] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, parsed.data.categoryId))
    .limit(1);
  if (!categoryRow) return { ok: false };

  const uploadedFiles = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File);
  const imageUrls = await saveUploadedImages(uploadedFiles);
  if (uploadedFiles.some((file) => file.size > 0) && imageUrls.length === 0) {
    return { ok: false };
  }

  const inserted = await db
    .insert(items)
    .values({
      name: parsed.data.name,
      category: categoryRow.name,
      price: parsed.data.price,
      discountedPrice: parsed.data.discountedPrice || null,
      ...(await hasFeaturedColumn()
        ? { isFeatured: formData.get("isFeatured")?.toString() === "true" }
        : {}),
      description: parsed.data.description || null,
      ...(await hasCustomizationColumns()
        ? {
            cakeWeights: parseOptionsJson(formData.get("cakeWeights")),
            cakeShapes: parseOptionsJson(formData.get("cakeShapes")),
            cakeTiers: parseOptionsJson(formData.get("cakeTiers")),
            cakeAddons: parseOptionsJson(formData.get("cakeAddons")),
          }
        : {}),
    })
    .returning({ id: items.id });

  const itemId = inserted[0]?.id;
  if (itemId && imageUrls.length > 0) {
    await db.insert(itemImages).values(
      imageUrls.map((imageUrl, index) => ({
        itemId,
        imageUrl,
        sortOrder: index,
      })),
    );
  }

  revalidatePath("/admin/items");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true };
}

export async function updateItem(formData: FormData): Promise<UpdateItemState> {
  await requireAdmin();
  const parsed = updateItemSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    discountedPrice: formData.get("discountedPrice")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
  });
  if (!parsed.success) return { ok: false };

  const db = getDb();

  const [categoryRow] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, parsed.data.categoryId))
    .limit(1);
  if (!categoryRow) return { ok: false };

  const [existing] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, parsed.data.id))
    .limit(1);
  if (!existing) return { ok: false };

  const uploadedFiles = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File)
    .filter((file) => file.size > 0);

  if (uploadedFiles.length > 0) {
    const [existingImageCount] = await db
      .select({ count: count() })
      .from(itemImages)
      .where(eq(itemImages.itemId, parsed.data.id));
    const prevCount = existingImageCount?.count ?? 0;
    if (prevCount + uploadedFiles.length > MAX_IMAGE_COUNT) return { ok: false };

    const imageUrls = await saveUploadedImages(uploadedFiles);
    if (imageUrls.length === 0) return { ok: false };

    const [lastImage] = await db
      .select({ sortOrder: itemImages.sortOrder })
      .from(itemImages)
      .where(eq(itemImages.itemId, parsed.data.id))
      .orderBy(desc(itemImages.sortOrder))
      .limit(1);
    let nextSort = (lastImage?.sortOrder ?? -1) + 1;

    await db.insert(itemImages).values(
      imageUrls.map((imageUrl) => {
        const row = {
          itemId: parsed.data.id,
          imageUrl,
          sortOrder: nextSort,
        };
        nextSort += 1;
        return row;
      }),
    );
  }

  await db
    .update(items)
    .set({
      name: parsed.data.name,
      category: categoryRow.name,
      price: parsed.data.price,
      discountedPrice: parsed.data.discountedPrice || null,
      description: parsed.data.description || null,
      ...(await hasFeaturedColumn()
        ? { isFeatured: formData.get("isFeatured")?.toString() === "true" }
        : {}),
      ...(await hasCustomizationColumns()
        ? {
            cakeWeights: parseOptionsJson(formData.get("cakeWeights")),
            cakeShapes: parseOptionsJson(formData.get("cakeShapes")),
            cakeTiers: parseOptionsJson(formData.get("cakeTiers")),
            cakeAddons: parseOptionsJson(formData.get("cakeAddons")),
          }
        : {}),
    })
    .where(eq(items.id, parsed.data.id));

  revalidatePath("/admin/items");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath(`/items/${parsed.data.id}`);

  return { ok: true };
}

export async function toggleItemActive(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  const current = formData.get("current")?.toString() === "true";
  if (!id) return;

  await getDb().update(items).set({ isActive: !current }).where(eq(items.id, id));
  revalidatePath("/admin/items");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleItemFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!(await hasFeaturedColumn())) return;
  const id = formData.get("id")?.toString();
  const current = formData.get("current")?.toString() === "true";
  if (!id) return;

  await getDb().update(items).set({ isFeatured: !current }).where(eq(items.id, id));
  revalidatePath("/admin/items");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await getDb().delete(items).where(eq(items.id, id));
  revalidatePath("/admin/items");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function getDashboardStats() {
  await requireAdmin();
  const db = getDb();

  const [ordersCount] = await db.select({ value: count() }).from(orders);
  const [newOrdersCount] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, "new"));
  const [itemsCount] = await db.select({ value: count() }).from(items);
  const [activeItemsCount] = await db
    .select({ value: count() })
    .from(items)
    .where(eq(items.isActive, true));

  return {
    ordersTotal: ordersCount?.value ?? 0,
    ordersNew: newOrdersCount?.value ?? 0,
    itemsTotal: itemsCount?.value ?? 0,
    itemsActive: activeItemsCount?.value ?? 0,
  };
}

// One-off helper: seed random option arrays for existing items.
// Not wired to any UI; call manually from a temporary route or script.
export async function seedRandomOptionsForExistingItems() {
  await requireAdmin();
  if (!(await hasCustomizationColumns())) return;

  const db = getDb();

  const WEIGHTS = ["250g", "500g", "750g", "1kg", "1.5kg", "2kg"] as const;
  const SHAPES = ["Round", "Square", "Heart", "Rectangle", "Star", "Hexagon"] as const;
  const TIERS = ["Single", "2-Tier", "3-Tier", "4-Tier"] as const;
  const ADDONS = [
    "Fresh Flowers",
    "Chocolate Shavings",
    "Edible Glitter",
    "Macarons",
    "Berries",
    "Gold Leaf",
  ] as const;

  const rows = await db
    .select({
      id: items.id,
      cakeWeights: items.cakeWeights,
      cakeShapes: items.cakeShapes,
      cakeTiers: items.cakeTiers,
      cakeAddons: items.cakeAddons,
    })
    .from(items);

  for (const row of rows) {
    const hasAny =
      row.cakeWeights !== null ||
      row.cakeShapes !== null ||
      row.cakeTiers !== null ||
      row.cakeAddons !== null;

    // Skip items that already have some options to avoid overwriting manual data.
    if (hasAny) continue;

    const weights = pickRandomSubset(WEIGHTS, 2, 4);
    const shapes = pickRandomSubset(SHAPES, 2, 4);
    const tiers = pickRandomSubset(TIERS, 1, 3);
    const addons = pickRandomSubset(ADDONS, 2, 4);

    await db
      .update(items)
      .set({
        cakeWeights: weights.length ? JSON.stringify(weights) : null,
        cakeShapes: shapes.length ? JSON.stringify(shapes) : null,
        cakeTiers: tiers.length ? JSON.stringify(tiers) : null,
        cakeAddons: addons.length ? JSON.stringify(addons) : null,
      })
      .where(eq(items.id, row.id));
  }

  revalidatePath("/admin/items");
  revalidatePath("/admin");
  revalidatePath("/menu");
  revalidatePath("/");
}
