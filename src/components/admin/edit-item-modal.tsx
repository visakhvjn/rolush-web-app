"use client";

import { updateItem } from "@/actions/items";
import type { CategoryRow, ItemRow } from "@/db/schema";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { ItemOptionRows } from "@/components/admin/item-option-rows";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function parseStoredOptions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const vals = parsed.map((x) => String(x).trim()).filter(Boolean);
    return vals.length > 0 ? vals : [];
  } catch {
    return [];
  }
}

function optionsForEditing(raw: string | null): string[] {
  const vals = parseStoredOptions(raw);
  return vals.length > 0 ? vals : [""];
}

export function EditItemModal({
  item,
  categories,
}: {
  item: ItemRow;
  categories: CategoryRow[];
}) {
  const [open, setOpen] = useState(false);
  const defaultCategoryId = useMemo(() => {
    const match = categories.find((c) => c.name === item.category);
    return match?.id ?? "";
  }, [categories, item.category]);

  const [weights, setWeights] = useState<string[]>(() => optionsForEditing(item.cakeWeights));
  const [shapes, setShapes] = useState<string[]>(() => optionsForEditing(item.cakeShapes));
  const [tiers, setTiers] = useState<string[]>(() => optionsForEditing(item.cakeTiers));
  const [addons, setAddons] = useState<string[]>(() => optionsForEditing(item.cakeAddons));

  useEffect(() => {
    if (!open) return;
    setWeights(optionsForEditing(item.cakeWeights));
    setShapes(optionsForEditing(item.cakeShapes));
    setTiers(optionsForEditing(item.cakeTiers));
    setAddons(optionsForEditing(item.cakeAddons));
  }, [open, item.cakeWeights, item.cakeShapes, item.cakeTiers, item.cakeAddons]);

  async function handleSubmit(formData: FormData) {
    const normalize = (values: string[]) =>
      values.map((value) => value.trim()).filter((value) => value.length > 0);
    formData.set("cakeWeights", JSON.stringify(normalize(weights)));
    formData.set("cakeShapes", JSON.stringify(normalize(shapes)));
    formData.set("cakeTiers", JSON.stringify(normalize(tiers)));
    formData.set("cakeAddons", JSON.stringify(normalize(addons)));

    const result = await updateItem(formData);
    if (result.ok) {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-[#d4dde6] px-2.5 py-1 text-xs text-[#0f2f4f] hover:bg-[#edf2f8]"
      >
        Edit
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0f2f4f]">Edit item</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[#d4dde6] px-2 py-1 text-xs text-[#35506a] hover:bg-[#edf2f8]"
              >
                Close
              </button>
            </div>

            <form
              action={handleSubmit}
              encType="multipart/form-data"
              className="mt-4 grid gap-3"
            >
              <input type="hidden" name="id" value={item.id} />
              <input
                name="name"
                placeholder="Item name"
                required
                defaultValue={item.name}
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <div className="space-y-1">
                <label htmlFor={`categoryId-edit-${item.id}`} className="block text-xs font-medium text-[#4f6479]">
                  Category
                </label>
                <select
                  id={`categoryId-edit-${item.id}`}
                  name="categoryId"
                  required={categories.length > 0}
                  disabled={categories.length === 0}
                  defaultValue={defaultCategoryId || ""}
                  className="w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {categories.length === 0 ? (
                    <option value="">Add categories first</option>
                  ) : (
                    <>
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {categories.length === 0 ? (
                  <p className="text-xs text-[#4f6479]">
                    <Link href="/admin/categories" className="text-[#b8944f] underline">
                      Create categories
                    </Link>
                  </p>
                ) : null}
                {!defaultCategoryId && categories.length > 0 ? (
                  <p className="text-xs text-amber-800">
                    Current category name &quot;{item.category}&quot; didn&apos;t match a row—pick the correct category.
                  </p>
                ) : null}
              </div>
              <input
                name="price"
                placeholder="Actual price (e.g. 1200)"
                required
                defaultValue={item.price}
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <input
                name="discountedPrice"
                placeholder="Discounted price (optional)"
                defaultValue={item.discountedPrice ?? ""}
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                rows={8}
                defaultValue={item.description ?? ""}
                className="min-h-[10rem] w-full resize-y rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <label className="inline-flex items-center gap-2 text-sm text-[#35506a]">
                <input
                  type="checkbox"
                  name="isFeatured"
                  value="true"
                  defaultChecked={item.isFeatured}
                />
                Mark as featured item
              </label>
              <ItemOptionRows
                title="Cake weights"
                options={weights}
                onChange={(index, value) =>
                  setWeights((prev) => prev.map((v, i) => (i === index ? value : v)))
                }
                onAdd={() => setWeights((prev) => [...prev, ""])}
                onRemove={(index) => setWeights((prev) => prev.filter((_, i) => i !== index))}
              />
              <ItemOptionRows
                title="Cake shapes"
                options={shapes}
                onChange={(index, value) =>
                  setShapes((prev) => prev.map((v, i) => (i === index ? value : v)))
                }
                onAdd={() => setShapes((prev) => [...prev, ""])}
                onRemove={(index) => setShapes((prev) => prev.filter((_, i) => i !== index))}
              />
              <ItemOptionRows
                title="Cake tiers"
                options={tiers}
                onChange={(index, value) =>
                  setTiers((prev) => prev.map((v, i) => (i === index ? value : v)))
                }
                onAdd={() => setTiers((prev) => [...prev, ""])}
                onRemove={(index) => setTiers((prev) => prev.filter((_, i) => i !== index))}
              />
              <ItemOptionRows
                title="Add-ons"
                options={addons}
                onChange={(index, value) =>
                  setAddons((prev) => prev.map((v, i) => (i === index ? value : v)))
                }
                onAdd={() => setAddons((prev) => [...prev, ""])}
                onRemove={(index) => setAddons((prev) => prev.filter((_, i) => i !== index))}
              />
              <div className="space-y-1">
                <label htmlFor={`images-edit-${item.id}`} className="block text-xs font-medium text-[#4f6479]">
                  Add images (optional, appends to existing)
                </label>
                <input
                  id={`images-edit-${item.id}`}
                  name="images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] file:mr-3 file:rounded-md file:border-0 file:bg-[#e6edf4] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#1f4568] hover:file:bg-[#d6e2ef]"
                />
                <p className="text-xs text-[#4f6479]">
                  Up to 12 images total per item. Max 8MB each. PNG, JPG, WEBP, GIF.
                </p>
              </div>
              <FormSubmitButton
                idleLabel="Save changes"
                pendingLabel="Saving..."
                disabled={categories.length === 0}
                className="w-fit rounded-full bg-[#0f2f4f] px-5 py-2 text-sm font-medium text-white hover:bg-[#0b2239] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
