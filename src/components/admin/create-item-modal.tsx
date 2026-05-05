"use client";

import { createItem } from "@/actions/items";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import Link from "next/link";
import { useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type CreateItemModalProps = {
  categories: CategoryOption[];
};

export function CreateItemModal({ categories }: CreateItemModalProps) {
  const [open, setOpen] = useState(false);

  async function handleCreateItem(formData: FormData) {
    const result = await createItem(formData);
    if (result.ok) {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-[#0f2f4f] px-5 py-2 text-sm font-medium text-white hover:bg-[#0b2239]"
      >
        Add item
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0f2f4f]">Add new item</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[#d4dde6] px-2 py-1 text-xs text-[#35506a] hover:bg-[#edf2f8]"
              >
                Close
              </button>
            </div>

            <form
              action={handleCreateItem}
              encType="multipart/form-data"
              className="mt-4 grid gap-3"
            >
              <input
                name="name"
                placeholder="Item name"
                required
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <div className="space-y-1">
                <label htmlFor="categoryId" className="block text-xs font-medium text-[#4f6479]">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required={categories.length > 0}
                  disabled={categories.length === 0}
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
                    </Link>{" "}
                    to enable this field.
                  </p>
                ) : null}
              </div>
              <input
                name="price"
                placeholder="Actual price (e.g. Rs 1200)"
                required
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <input
                name="discountedPrice"
                placeholder="Discounted price (optional)"
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <input
                name="description"
                placeholder="Short description (optional)"
                className="rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <label className="inline-flex items-center gap-2 text-sm text-[#35506a]">
                <input type="checkbox" name="isFeatured" value="true" />
                Mark as featured item
              </label>
              <div className="space-y-1">
                <label htmlFor="images" className="block text-xs font-medium text-[#4f6479]">
                  Images (optional, multiple)
                </label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] file:mr-3 file:rounded-md file:border-0 file:bg-[#e6edf4] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#1f4568] hover:file:bg-[#d6e2ef]"
                />
                <p className="text-xs text-[#4f6479]">
                  Up to 12 images. Max 8MB each. PNG, JPG, WEBP, GIF.
                </p>
              </div>
              <FormSubmitButton
                idleLabel="Add item"
                pendingLabel="Adding item..."
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
