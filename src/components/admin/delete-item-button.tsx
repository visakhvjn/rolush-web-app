"use client";

import { deleteItem } from "@/actions/items";

type DeleteItemButtonProps = {
  itemId: string;
  itemName: string;
};

export function DeleteItemButton({ itemId, itemName }: DeleteItemButtonProps) {
  return (
    <form
      action={deleteItem}
      onSubmit={(event) => {
        const ok = window.confirm(`Delete item "${itemName}"?`);
        if (!ok) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={itemId} />
      <button
        type="submit"
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
