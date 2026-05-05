"use client";

import { createCategory } from "@/actions/categories";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { useState } from "react";

export function CreateCategoryModal() {
  const [open, setOpen] = useState(false);
  async function handleCreateCategory(formData: FormData) {
    const result = await createCategory(formData);
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
        Add category
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0f2f4f]">Add category</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[#d4dde6] px-2 py-1 text-xs text-[#35506a] hover:bg-[#edf2f8]"
              >
                Close
              </button>
            </div>

            <form
              action={handleCreateCategory}
              encType="multipart/form-data"
              className="mt-4 grid gap-3"
            >
              <div className="min-w-[180px]">
                <label htmlFor="name" className="block text-xs font-medium text-[#4f6479]">
                  Name of category
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="e.g. Birthday, Wedding"
                  required
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
                />
              </div>
              <div className="min-w-[180px]">
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-[#4f6479]"
                >
                  Short description
                </label>
                <input
                  id="description"
                  name="description"
                  placeholder="e.g. Cakes for birthdays"
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
                />
              </div>
              <div className="min-w-[180px]">
                <label htmlFor="image" className="block text-xs font-medium text-[#4f6479]">
                  Image (optional)
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] file:mr-3 file:rounded-md file:border-0 file:bg-[#e6edf4] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#1f4568] hover:file:bg-[#d6e2ef]"
                />
              </div>
              <FormSubmitButton
                idleLabel="Add category"
                pendingLabel="Adding..."
                className="w-fit rounded-full bg-[#0f2f4f] px-5 py-2 text-sm font-medium text-white hover:bg-[#0b2239]"
              />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
