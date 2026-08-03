//new design for role management - in progress

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import RolePermissionPage from "./RolePermissionPage";

const roles = ["Super Admin", "Admin", "Manager", "Viewer"];

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState("Admin");
  return (
    <>
      <PageMeta title="Role Management" description="Role management section" />
      <PageBreadcrumb pageTitle="Role Management" />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03] h-[calc(100vh-180px)]">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/5 border-r border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Roles
            </div>

            <div className="flex md:flex-col ">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`relative flex w-full items-center px-4 py-3 text-left text-sm transition-colors duration-200
                    ${
                      selectedRole === role
                        ? "border-l-4 border-blue-600 bg-blue-50 text-blue-700 font-medium"
                        : "border-l-4 border-transparent text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Add Role Button */}
            <div className="p-4">
              <Button
                size="sm"
                variant="outline"
                title="Create New User Role"
                className="w-full"
              >
                + {"  "}New Role
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-4/5 p-6">
            <RolePermissionPage role={selectedRole} />
          </div>
        </div>
      </div>
    </>
  );
}

// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import PageMeta from "@/components/common/PageMeta";
// import TableGrid from "@/components/table/TableGrid";
// import { Role } from "@/types/userRoles.types";
// import { useCallback, useEffect, useState } from "react";

// import type { ColumnDef, SortState } from "@/components/table/types";
// import { PAGE_SIZE_DEFAULT } from "@/utils/constants";
// import { ListParams, listUserRoles } from "@/services/userRolesService";
// import { toast } from "@/components/toast/useToast";

// function buildColumns(): ColumnDef<Role>[] {
//   return [
//     {
//       key: "name",
//       header: "Name",
//       sortable: true,
//     },
//     {
//       key: "description",
//       header: "Description",
//       sortable: true,
//     },
//   ];
// }

// export default function RoleManagement() {
//   // Column defs created once — stable reference
//   const [columns] = useState(() => buildColumns());

//   const [roles, setRoles] = useState<Role[]>([]);

//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
//   const [sort, setSort] = useState<SortState>({
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const handleSortChange = useCallback((newSort: SortState) => {
//     setSort(newSort);
//     setPage(1);
//   }, []);

//   const handlePageSizeChange = useCallback((size: number) => {
//     setPageSize(size);
//     setPage(1);
//   }, []);

//   const fetchUserRoles = useCallback(async (params: ListParams) => {
//     setLoading(true);
//     try {
//       const data = await listUserRoles(params);
//       setRoles(data.roles);
//       setTotal(data.total);
//     } catch {
//       toast.error("Failed to load users. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUserRoles({
//       page,
//       limit: pageSize,
//       sortBy: sort.sortBy,
//       sortOrder: sort.sortOrder,
//     });
//   }, [page, pageSize, sort, fetchUserRoles]);

//   return (
//     <>
//       <PageMeta title="Role Management" description="Role management section" />
//       <PageBreadcrumb pageTitle="Role Mangement" />
//       <div className="space-y-6">
//         <TableGrid<Role>
//           columns={columns}
//           data={roles}
//           loading={loading}
//           rowKey="id"
//           pagination={{ page, pageSize, total }}
//           onPageChange={setPage}
//           pageSizeOptions={[10, 25, 50]}
//           onPageSizeChange={handlePageSizeChange}
//           sort={sort}
//           onSortChange={handleSortChange}
//           emptyMessage="No Record found."
//         />
//       </div>
//     </>
//   );
// }
