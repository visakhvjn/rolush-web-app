"use server";

import { auth } from "@/auth";
import { getDb } from "@/db";
import {
  categories,
  itemImages,
  items,
  orders,
  type ItemRow,
} from "@/db/schema";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
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

export type ItemWithImages = ItemRow & {
  images: string[];
};

let featuredColumnSupported: boolean | null = null;

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

  const uploadDir = path.join(process.cwd(), "public", "uploads", "items");
  await mkdir(uploadDir, { recursive: true });

  const savedUrls: string[] = [];
  for (const file of validFiles) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) return [];
    if (file.size > MAX_IMAGE_SIZE_BYTES) return [];

    const ext = extFromImageType(file.type);
    if (!ext) return [];

    const fileName = `${randomUUID()}.${ext}`;
    const outputPath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(outputPath, Buffer.from(arrayBuffer));
    savedUrls.push(`/uploads/items/${fileName}`);
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
    })
    .from(items)
    .orderBy(desc(items.createdAt));
  return rows.map((row) => ({ ...row, isFeatured: false }));
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
