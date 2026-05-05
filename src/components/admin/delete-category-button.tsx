"use client";

import { deleteCategory } from "@/actions/categories";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  return (
    <form
      action={deleteCategory}
      onSubmit={(event) => {
        const ok = window.confirm(`Delete category "${categoryName}"?`);
        if (!ok) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={categoryId} />
      <button
        type="submit"
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
