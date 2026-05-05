import { listCategories } from "@/actions/categories";
import { listItems, toggleItemActive, toggleItemFeatured } from "@/actions/items";
import { CreateItemModal } from "@/components/admin/create-item-modal";
import { EditItemModal } from "@/components/admin/edit-item-modal";
import { DeleteItemButton } from "@/components/admin/delete-item-button";
import { TablePagination } from "@/components/admin/table-pagination";

const PAGE_SIZE = 10;

function formatRsPrice(value: string | null | undefined): string {
  const raw = (value ?? "").toString().trim();
  // Stored values may include "Rs " from earlier UI copy; normalize for display.
  return raw.replace(/^(rs)\s*/i, "").trim();
}

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const [rows, categoryRows] = await Promise.all([listItems(), listCategories()]);
  const pageRaw = typeof sp.page === "string" ? sp.page : "1";
  const parsedPage = Number.parseInt(pageRaw, 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const pagedRows = rows.slice(offset, offset + PAGE_SIZE);

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
              <th className="w-[40%] px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price (Rs)</th>
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
              pagedRows.map((row) => (
                <tr key={row.id}>
                  <td className="w-[40%] px-4 py-3">
                    <p className="font-medium text-[#0f2f4f]">{row.name}</p>
                    {row.description ? (
                      <p className="line-clamp-2 text-xs text-[#4f6479]" title={row.description}>
                        {row.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[#4f6479]">{row.category}</td>
                  <td className="px-4 py-3 text-[#4f6479]">
                    {row.discountedPrice ? (
                      <div className="space-y-0.5">
                        <p className="text-xs text-[#6d8196] line-through">
                          {formatRsPrice(row.price)}
                        </p>
                        <p className="font-medium text-[#0f2f4f]">
                          {formatRsPrice(row.discountedPrice)}
                        </p>
                      </div>
                    ) : (
                      formatRsPrice(row.price)
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
                    <div className="flex flex-wrap justify-end gap-2">
                      <EditItemModal item={row} categories={categoryRows} />
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
        <TablePagination
          basePath="/admin/items"
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={sp}
        />
      </section>
    </main>
  );
}
