import { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

export interface ColumnDef<TData> {
  /** Unique column key — also used to access `row[key]` when no `render` is provided */
  key: string;
  /** Column header label */
  header: string;
  /** Enable click-to-sort on this column header */
  sortable?: boolean;
  /** Show a filter input below the header for this column */
  filterable?: boolean;
  /** Custom cell renderer. Falls back to `String(row[key])` when omitted */
  render?: (value: unknown, row: TData, rowIndex: number) => ReactNode;
  /** Extra className on every body cell in this column */
  className?: string;
  /** Extra className on the header cell */
  headerClassName?: string;
}

export interface PaginationState {
  /** 1-based current page */
  page: number;
  pageSize: number;
  /** Total record count from the server */
  total: number;
}

export interface SortState {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

/** Key → filter value map passed to the server */
export type FilterState = Record<string, string>;

export interface TableGridProps<TData extends AnyRecord> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** Shows skeleton rows while true */
  loading?: boolean;
  /** Row identity — keyof TData or a function returning a unique string/number */
  rowKey: keyof TData | ((row: TData) => string | number);

  // ── Pagination ──────────────────────────────────────────────────────────
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  /** Defaults to [10, 25, 50] */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;

  // ── Sorting ─────────────────────────────────────────────────────────────
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;

  // ── Filtering ───────────────────────────────────────────────────────────
  /** Current filter values — controlled by the parent */
  filters?: FilterState;
  /** Called 300 ms after the user stops typing in a filter input */
  onFilterChange?: (filters: FilterState) => void;

  // ── Display ─────────────────────────────────────────────────────────────
  emptyMessage?: string;
}
