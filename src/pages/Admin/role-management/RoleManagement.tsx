import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import TableGrid from "@/components/table/TableGrid";
import { Role } from "@/types/userRoles.types";
import { useCallback, useEffect, useState } from "react";

import type { ColumnDef, SortState } from "@/components/table/types";
import { PAGE_SIZE_DEFAULT } from "@/utils/constants";
import { ListParams, listUserRoles } from "@/services/userRolesService";
import { toast } from "@/components/toast/useToast";

function buildColumns(): ColumnDef<Role>[] {
  return [
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
    },
  ];
}

export default function RoleManagement() {
  // Column defs created once — stable reference
  const [columns] = useState(() => buildColumns());

  const [roles, setRoles] = useState<Role[]>([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [sort, setSort] = useState<SortState>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleSortChange = useCallback((newSort: SortState) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const fetchUserRoles = useCallback(async (params: ListParams) => {
    setLoading(true);
    try {
      const data = await listUserRoles(params);
      setRoles(data.roles);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRoles({
      page,
      limit: pageSize,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });
  }, [page, pageSize, sort, fetchUserRoles]);

  return (
    <>
      <PageMeta title="Role Management" description="Role management section" />
      <PageBreadcrumb pageTitle="Role Mangement" />
      <div className="space-y-6">
        <TableGrid<Role>
          columns={columns}
          data={roles}
          loading={loading}
          rowKey="id"
          pagination={{ page, pageSize, total }}
          onPageChange={setPage}
          pageSizeOptions={[10, 25, 50]}
          onPageSizeChange={handlePageSizeChange}
          sort={sort}
          onSortChange={handleSortChange}
          emptyMessage="No Record found."
        />
      </div>
    </>
  );
}
