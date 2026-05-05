import { listCategories } from "@/actions/categories";
import { listItems, toggleItemActive, toggleItemFeatured } from "@/actions/items";
import { CreateItemModal } from "@/components/admin/create-item-modal";
import { DeleteItemButton } from "@/components/admin/delete-item-button";

export default async function AdminItemsPage() {
  const [rows, categoryRows] = await Promise.all([listItems(), listCategories()]);

  return (
    <main className="px-4 py-8 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#0f2f4f]">Items</h1>
          <p className="mt-1 text-sm text-[#4f6479]">
            Manage the cakes and products shown to customers.
          </p>
        </div>
        <CreateItemModal categories={categoryRows} />
      </div>

      <section className="mt-2 overflow-hidden rounded-xl border border-[#d4dde6] bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#edf2f8] text-xs uppercase tracking-wide text-[#4f6479]">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6edf4]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#4f6479]">
                  No items yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0f2f4f]">{row.name}</p>
                    {row.description ? (
                      <p className="text-xs text-[#4f6479]">{row.description}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[#4f6479]">{row.category}</td>
                  <td className="px-4 py-3 text-[#4f6479]">
                    {row.discountedPrice ? (
                      <div className="space-y-0.5">
                        <p className="text-xs text-[#6d8196] line-through">{row.price}</p>
                        <p className="font-medium text-[#0f2f4f]">{row.discountedPrice}</p>
                      </div>
                    ) : (
                      row.price
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#d9e4f0] px-2.5 py-0.5 text-xs font-medium text-[#1f4568]">
                      {row.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#f0e3cb] px-2.5 py-0.5 text-xs font-medium text-[#7a5f2d]">
                      {row.isFeatured ? "Featured" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={toggleItemActive}>
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="current"
                          value={row.isActive ? "true" : "false"}
                        />
                        <button
                          type="submit"
                          className="rounded-md border border-[#d4dde6] px-2.5 py-1 text-xs text-[#0f2f4f] hover:bg-[#edf2f8]"
                        >
                          {row.isActive ? "Hide" : "Activate"}
                        </button>
                      </form>
                      <form action={toggleItemFeatured}>
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="current"
                          value={row.isFeatured ? "true" : "false"}
                        />
                        <button
                          type="submit"
                          className="rounded-md border border-[#d4dde6] px-2.5 py-1 text-xs text-[#0f2f4f] hover:bg-[#edf2f8]"
                        >
                          {row.isFeatured ? "Unfeature" : "Feature"}
                        </button>
                      </form>
                      <DeleteItemButton itemId={row.id} itemName={row.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
