import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

type TablePaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams?: SearchParams;
};

function buildHref({
  basePath,
  searchParams,
  page,
}: {
  basePath: string;
  searchParams?: SearchParams;
  page: number;
}) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;

      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item);
        }
        continue;
      }

      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function TablePagination({
  basePath,
  currentPage,
  totalPages,
  searchParams,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="flex items-center justify-between border-t border-[#e6edf4] px-4 py-3 text-sm">
      <div className="text-[#4f6479]">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        {previousPage >= 1 ? (
          <Link
            href={buildHref({
              basePath,
              searchParams,
              page: previousPage,
            })}
            className="rounded-md border border-[#d4dde6] px-3 py-1.5 text-[#0f2f4f] hover:bg-[#edf2f8]"
          >
            Previous
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-md border border-[#e6edf4] px-3 py-1.5 text-[#9aabba]">
            Previous
          </span>
        )}
        {nextPage <= totalPages ? (
          <Link
            href={buildHref({
              basePath,
              searchParams,
              page: nextPage,
            })}
            className="rounded-md border border-[#d4dde6] px-3 py-1.5 text-[#0f2f4f] hover:bg-[#edf2f8]"
          >
            Next
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-md border border-[#e6edf4] px-3 py-1.5 text-[#9aabba]">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
