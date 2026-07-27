import { useCallback, useEffect, useRef, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import TableGrid from "@/components/table/TableGrid";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

import { toast } from "@/components/toast/useToast";
import type {
  ColumnDef,
  FilterState,
  SortState,
} from "@/components/table/types";
import { PencilIcon, TrashBinIcon, PlusCircleIcon } from "@/icons";

import {
  listUsers,
  updateUser,
  deleteUser,
  type ListUsersParams,
} from "@/services/userService";
import type { User } from "@/types/user.types";
import {
  type UpdateUserFormData,
} from "@/validations/user.schema";
import { getApiErrorMessage } from "@/utils/apiError";

import { PAGE_SIZE_DEFAULT } from "@/utils/constants";
import CreateUpdateUserModal from "./CreateUpdateUserModal";

// ─── Column definitions ───────────────────────────────────────────────────────
// Defined outside the component — stable reference, never triggers re-renders.
// onEdit / onDelete are injected via a mutable ref to avoid column redefinition.

type ActionHandlers = {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

function buildColumns(
  handlers: React.RefObject<ActionHandlers>,
): ColumnDef<User>[] {
  return [
    {
      key: "firstName",
      header: "Name",
      sortable: true,
      render: (_val, row) => {
        const initials =
          `${row.firstName[0] ?? ""}${row.lastName[0] ?? ""}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              {initials}
            </div>
            <span className="font-medium text-gray-800 dark:text-white/90">
              {row.firstName} {row.lastName}
            </span>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "userTenantRoles",
      header: "Role",
      render: (_val, row) => {
        const roleName = row.userTenantRoles[0]?.role.name ?? "—";
        return (
          <Badge
            size="sm"
            color={
              roleName === "ADMIN"
                ? "primary"
                : roleName === "MANAGER"
                  ? "info"
                  : "light"
            }
          >
            {roleName}
          </Badge>
        );
      },
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (_val, row) => (
        <Badge size="sm" color={row.isActive ? "success" : "warning"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (_val, row) =>
        new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "id",
      header: "Actions",
      render: (_val, row) => (
        <div className="flex items-center gap-2">
          <button
            title="Edit user"
            onClick={() => handlers.current?.onEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-brand-400"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            title="Delete user"
            onClick={() => handlers.current?.onDelete(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/10 dark:hover:text-error-400"
          >
            <TrashBinIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

interface DeleteModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

function DeleteUserModal({ user, onClose, onSuccess }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success("User deleted successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-sm p-6 sm:p-8">
      <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
        Delete User
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-800 dark:text-white/90">
          {user.firstName} {user.lastName}
        </span>
        ? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={deleting}
        >
          Cancel
        </Button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-error-500 px-4 py-3 text-sm text-white shadow-theme-xs transition hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setisEditMode] =useState(false);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [sort, setSort] = useState<SortState>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [filters, setFilters] = useState<FilterState>({});

  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // Mutable ref so column defs are created once and never redefined
  const handlersRef = useRef<ActionHandlers>({
    onEdit: (user) => {setEditTarget(user);
      setIsModalOpen(true);
      setisEditMode(true);
    },
    onDelete: (user) => setDeleteTarget(user),
  });

  // Keep handlers up to date without recreating columns
  handlersRef.current = {
    onEdit: (user) => {setEditTarget(user);
      setIsModalOpen(true);
      setisEditMode(true);
    },
    onDelete: (user) => setDeleteTarget(user),
  };

  // Column defs created once — stable reference
  const [columns] = useState(() => buildColumns(handlersRef));

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async (params: ListUsersParams) => {
    setLoading(true);
    try {
      const data = await listUsers(params);
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers({
      page,
      limit: pageSize,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      ...filters,
    });
  }, [page, pageSize, sort, filters, fetchUsers]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortState) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const refetch = useCallback(() => {
    fetchUsers({
      page,
      limit: pageSize,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      ...filters,
    });
  }, [page, pageSize, sort, filters, fetchUsers]);

  const openCreateUserModal = () => {
    setIsModalOpen(true);
    setisEditMode(false);
  };


  const handleUserUpdate = async (data: UpdateUserFormData) => {
    if (!editTarget && !isEditMode) {
      console.log("add mode",data)
      return;
    }
    try {
      await updateUser(editTarget!.id, data);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Update failed. Please try again."),
      );
    } finally {
      refetch();
      setIsModalOpen(false);
      setEditTarget(null);
    }
  };

  const handleModalClose =()=>{
     setIsModalOpen(false);
      setEditTarget(null);
      setDeleteTarget(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <PageMeta title="User Management" description="Manage platform users" />
      <PageBreadcrumb pageTitle="User Management" />
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant="primary"
            title="Create user endpoint not yet available"
            onClick={openCreateUserModal}
          >
            + Create User
          </Button>
        </div>

        <TableGrid<User>
          columns={columns}
          data={users}
          loading={loading}
          rowKey="id"
          pagination={{ page, pageSize, total }}
          onPageChange={setPage}
          pageSizeOptions={[10, 25, 50]}
          onPageSizeChange={handlePageSizeChange}
          sort={sort}
          onSortChange={handleSortChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          emptyMessage="No users found."
        />
      </div>

      {isModalOpen && (
        <CreateUpdateUserModal
          user={editTarget|| null}
          onClose={handleModalClose}
          onSubmit={handleUserUpdate}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={handleModalClose}
          onSuccess={refetch}
        />
      )}
    </>
  );
}
