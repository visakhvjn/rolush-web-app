"use server";

import { auth } from "@/auth";
import { getDb } from "@/db";
import { orders, type OrderRow } from "@/db/schema";
import { and, desc, eq, gte, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(200),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  email: z.union([z.literal(""), z.string().email()]),
  eventDate: z.string().optional(),
  message: z.string().min(1, "Tell us about your cake").max(5000),
  imageUrl: z.union([z.literal(""), z.string().url()]),
});

const cartOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(200),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  email: z.union([z.literal(""), z.string().email()]),
  eventDate: z.string().optional(),
  cartItemsJson: z.string().min(1),
});

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.string().min(1),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  cakeMessage: z.string().max(200).optional(),
  shape: z.string().optional(),
  tier: z.string().optional(),
  addons: z.array(z.string()).optional(),
});

export type CreateOrderState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export type PlaceCartOrderState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function createOrder(
  _prev: CreateOrderState | undefined,
  formData: FormData,
): Promise<CreateOrderState> {
  const raw = {
    customerName: formData.get("customerName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    eventDate: formData.get("eventDate")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    imageUrl: formData.get("imageUrl")?.toString() ?? "",
  };

  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = parsed.data;
  const db = getDb();
  await db.insert(orders).values({
    customerName: data.customerName,
    phone: data.phone,
    email: data.email || null,
    eventDate: data.eventDate || null,
    message: data.message,
    imageUrl: data.imageUrl || null,
    source: "web",
  });

  return {
    ok: true,
    message:
      "Thanks — we received your request. We will contact you shortly to confirm details.",
  };
}

export async function placeCartOrder(
  _prev: PlaceCartOrderState | undefined,
  formData: FormData,
): Promise<PlaceCartOrderState> {
  const raw = {
    customerName: formData.get("customerName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    eventDate: formData.get("eventDate")?.toString() ?? "",
    cartItemsJson: formData.get("cartItemsJson")?.toString() ?? "",
  };

  const parsed = cartOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  let parsedCart: unknown = [];
  try {
    parsedCart = JSON.parse(parsed.data.cartItemsJson);
  } catch {
    return { ok: false, message: "Cart data is invalid. Please refresh and try again." };
  }

  const cartItemsResult = z.array(cartItemSchema).safeParse(parsedCart);
  if (!cartItemsResult.success || cartItemsResult.data.length === 0) {
    return { ok: false, message: "Your cart is empty. Add items before placing order." };
  }

  const lines = cartItemsResult.data.map(
    (item, index) =>
      `${index + 1}. ${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity} - ${
        item.price
      }${item.shape ? ` | Shape: ${item.shape}` : ""}${item.tier ? ` | Tier: ${item.tier}` : ""}${
        item.addons && item.addons.length > 0 ? ` | Add-ons: ${item.addons.join(", ")}` : ""
      }${item.cakeMessage ? ` | Cake message: ${item.cakeMessage}` : ""}`,
  );
  const message = `Cart order items:\n${lines.join("\n")}`;

  const db = getDb();
  await db.insert(orders).values({
    customerName: parsed.data.customerName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    eventDate: parsed.data.eventDate || null,
    message,
    source: "web-cart",
  });

  revalidatePath("/admin/orders");
  return { ok: true, message: "Order placed successfully." };
}

export async function listOrders(filters: {
  status?: OrderRow["status"] | "all";
  q?: string;
  fromDate?: string;
}): Promise<OrderRow[]> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const db = getDb();
  const conditions = [];

  if (filters.status && filters.status !== "all") {
    conditions.push(eq(orders.status, filters.status));
  }

  if (filters.q?.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(orders.customerName, term),
        ilike(orders.phone, term),
        ilike(orders.email, term),
      )!,
    );
  }

  if (filters.fromDate) {
    const start = new Date(`${filters.fromDate}T00:00:00.000Z`);
    conditions.push(gte(orders.createdAt, start));
  }

  const where =
    conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(orders)
    .where(where)
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: string): Promise<OrderRow | undefined> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const db = getDb();
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return rows[0];
}

const statusEnum = z.enum([
  "new",
  "confirmed",
  "in_progress",
  "ready",
  "completed",
  "cancelled",
]);

const updateSchema = z.object({
  id: z.string().uuid(),
  status: statusEnum,
  adminNotes: z.string().max(10000).optional(),
});

export async function updateOrder(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes")?.toString() ?? "",
  });

  if (!parsed.success) {
    return;
  }

  const db = getDb();
  await db
    .update(orders)
    .set({
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes || null,
    })
    .where(eq(orders.id, parsed.data.id));

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.id}`);
}
