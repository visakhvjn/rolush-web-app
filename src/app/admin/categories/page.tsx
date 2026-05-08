import { listCategories } from "@/actions/categories";
import { CreateCategoryModal } from "@/components/admin/create-category-modal";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { TablePagination } from "@/components/admin/table-pagination";
import { optimizeCloudinaryImageUrl } from "@/lib/cloudinary-url";

const PAGE_SIZE = 10;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const rows = await listCategories();
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
          <h1 className="font-serif text-2xl font-semibold text-[#0f2f4f]">Categories</h1>
          <p className="mt-1 text-sm text-[#4f6479]">
            Categories appear in the dropdown when you add or edit items on the Items page.
          </p>
        </div>
        <CreateCategoryModal />
      </div>

      <section className="mt-2 overflow-hidden rounded-xl border border-[#d4dde6] bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#edf2f8] text-xs uppercase tracking-wide text-[#4f6479]">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6edf4]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#4f6479]">
                  No categories yet. Add one from the button above.
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    {row.imageUrl ? (
                      <img
                        src={optimizeCloudinaryImageUrl(row.imageUrl, {
                          width: 96,
                          height: 96,
                        })}
                        alt={row.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-[#e3ebf4]" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0f2f4f]">{row.name}</td>
                  <td className="px-4 py-3 text-[#4f6479]">{row.description || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DeleteCategoryButton categoryId={row.id} categoryName={row.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <TablePagination
          basePath="/admin/categories"
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={sp}
        />
      </section>
    </main>
  );
}
