import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AnyRecord,
  ColumnDef,
  FilterState,
  PaginationState,
  SortState,
  TableGridProps,
} from "./types";

// ─── Sort icon ───────────────────────────────────────────────────────────────

interface SortIconProps {
  active: boolean;
  sortOrder: "asc" | "desc" | null;
}

const SortIcon = memo(function SortIcon({ active, sortOrder }: SortIconProps) {
  return (
    <span className="inline-flex flex-col gap-[2px]">
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
        className={
          active && sortOrder === "asc"
            ? "text-brand-500"
            : "text-gray-300 dark:text-gray-600"
        }
      >
        <path d="M4 0L7.46 4.5H0.54L4 0Z" fill="currentColor" />
      </svg>
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
        className={
          active && sortOrder === "desc"
            ? "text-brand-500"
            : "text-gray-300 dark:text-gray-600"
        }
      >
        <path d="M4 5L0.54 0.5H7.46L4 5Z" fill="currentColor" />
      </svg>
    </span>
  );
});

// ─── Skeleton row ────────────────────────────────────────────────────────────

const SkeletonRow = memo(function SkeletonRow({
  colCount,
}: {
  colCount: number;
}) {
  return (
    <tr>
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-white/[0.06]" />
        </td>
      ))}
    </tr>
  );
});

// ─── Pagination ──────────────────────────────────────────────────────────────

interface PaginationProps {
  pagination: PaginationState;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSizeOptions: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

const Pagination = memo(function Pagination({
  pagination,
  totalPages,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const { page, pageSize, total } = pagination;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const handlePrev = useCallback(
    () => onPageChange(page - 1),
    [page, onPageChange],
  );
  const handleNext = useCallback(
    () => onPageChange(page + 1),
    [page, onPageChange],
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/[0.05] sm:flex-row">
      {/* Results summary */}
      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
        {total === 0
          ? "No results"
          : `Showing ${from}–${to} of ${total} results`}
      </p>

      <div className="flex items-center gap-3">
        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Rows
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded border border-gray-200 bg-transparent px-2 py-1 text-xs text-gray-600 outline-none focus:border-brand-500 dark:border-white/10 dark:text-gray-300"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:border-brand-500 hover:text-brand-500 dark:border-white/10 dark:text-gray-400"
            aria-label="Previous page"
          >
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M1 1L5 5L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "…" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-7 w-5 items-center justify-center text-xs text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  className={`flex h-7 w-7 items-center justify-center rounded border text-xs transition-colors ${
                    item === page
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-gray-200 text-gray-500 hover:border-brand-500 hover:text-brand-500 dark:border-white/10 dark:text-gray-400"
                  }`}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </button>
              ),
            )}

          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:border-brand-500 hover:text-brand-500 dark:border-white/10 dark:text-gray-400"
            aria-label="Next page"
          >
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path
                d="M1 1L5 5L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

// ─── TableGrid ───────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
const SKELETON_ROW_COUNT = 5;
const FILTER_DEBOUNCE_MS = 300;

function TableGridInner<TData extends AnyRecord>({
  columns,
  data,
  loading = false,
  rowKey,
  pagination,
  onPageChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  sort,
  onSortChange,
  filters = {},
  onFilterChange,
  emptyMessage = "No data available",
}: TableGridProps<TData>) {
  // ── Local filter state (debounced before calling onFilterChange) ──────────
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Keep local state in sync when parent resets filters
  useEffect(() => {
    setLocalFilters(filters ?? {});
  }, [filters]);

  // Cleanup debounce timer on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const updated: FilterState = { ...localFilters, [key]: value };
      setLocalFilters(updated);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(
        () => onFilterChange?.(updated),
        FILTER_DEBOUNCE_MS,
      );
    },
    [localFilters, onFilterChange],
  );

  const handleSort = useCallback(
    (key: string) => {
      if (!onSortChange) return;
      onSortChange({
        sortBy: key,
        sortOrder:
          sort?.sortBy === key && sort.sortOrder === "asc" ? "desc" : "asc",
      });
    },
    [sort, onSortChange],
  );

  const getRowKey = useCallback(
    (row: TData, index: number): string | number => {
      if (typeof rowKey === "function") return rowKey(row);
      return (row[rowKey as keyof TData] as string | number) ?? index;
    },
    [rowKey],
  );

  // ── Derived values ────────────────────────────────────────────────────────

  const hasFilterRow = useMemo(
    () => onFilterChange != null && columns.some((c) => c.filterable),
    [columns, onFilterChange],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(pagination.total / pagination.pageSize)),
    [pagination.total, pagination.pageSize],
  );

  const skeletonRows = useMemo(
    () => Array.from({ length: SKELETON_ROW_COUNT }),
    [],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* ── Header ───────────────────────────────────────────────────── */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  isHeader
                  className={[
                    "px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400",
                    col.sortable && onSortChange
                      ? "cursor-pointer select-none"
                      : "",
                    col.headerClassName ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {col.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 font-medium"
                    >
                      {col.header}
                      <SortIcon
                        active={sort?.sortBy === col.key}
                        sortOrder={
                          sort?.sortBy === col.key ? sort.sortOrder : null
                        }
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableCell>
              ))}
            </TableRow>

            {/* Filter row — only rendered when at least one column is filterable */}
            {hasFilterRow && (
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key} isHeader className="px-4 py-2">
                    {col.filterable ? (
                      <input
                        type="text"
                        value={localFilters[col.key] ?? ""}
                        onChange={(e) =>
                          handleFilterChange(col.key, e.target.value)
                        }
                        placeholder={`Filter ${col.header}`}
                        className="w-full rounded border border-gray-200 bg-transparent px-2 py-1 text-xs text-gray-600 placeholder-gray-400 outline-none focus:border-brand-500 dark:border-white/10 dark:text-gray-300 dark:placeholder-gray-600"
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableHeader>

          {/* ── Body ─────────────────────────────────────────────────────── */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              skeletonRows.map((_, i) => (
                <SkeletonRow key={i} colCount={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-gray-400 text-theme-sm dark:text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={getRowKey(row, rowIndex)}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={[
                        "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
                        col.className ?? "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      <Pagination
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

// React.memo doesn't support generic type parameters directly —
// cast preserves the generic signature while still memoizing the component.
const TableGrid = memo(TableGridInner) as typeof TableGridInner;
export default TableGrid;
