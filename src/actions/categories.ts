"use server";

import { auth } from "@/auth";
import { getDb } from "@/db";
import { categories, type CategoryRow } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).optional(),
});

export type CreateCategoryState = {
  ok: boolean;
};

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFromImageType(type: string): string | undefined {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return undefined;
}

async function saveCategoryImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return null;
  if (file.size > MAX_IMAGE_SIZE_BYTES) return null;

  const ext = extFromImageType(file.type);
  if (!ext) return null;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
  await mkdir(uploadDir, { recursive: true });
  const fileName = `${randomUUID()}.${ext}`;
  const outputPath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(outputPath, Buffer.from(bytes));

  return `/uploads/categories/${fileName}`;
}

export async function listCategories(): Promise<CategoryRow[]> {
  await requireAdmin();
  return getDb()
    .select()
    .from(categories)
    .orderBy(asc(categories.name));
}

/** Public listing for marketing pages (no auth). */
export async function listPublicCategories(): Promise<CategoryRow[]> {
  return getDb()
    .select()
    .from(categories)
    .orderBy(asc(categories.name));
}

export async function createCategory(
  formData: FormData,
): Promise<CreateCategoryState> {
  await requireAdmin();
  const parsed = createCategorySchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
  });
  if (!parsed.success) return { ok: false };
  const imageFile = formData.get("image");
  const imageUrl = await saveCategoryImage(imageFile instanceof File ? imageFile : null);

  const inserted = await getDb()
    .insert(categories)
    .values({
      name: parsed.data.name,
      description: parsed.data.description || null,
      imageUrl,
    })
    .onConflictDoNothing({ target: categories.name })
    .returning({ id: categories.id });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/items");
  revalidatePath("/");
  return { ok: inserted.length > 0 };
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await getDb().delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/admin/items");
  revalidatePath("/");
}
