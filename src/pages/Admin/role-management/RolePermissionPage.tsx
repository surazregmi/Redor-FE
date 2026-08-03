import { useState } from "react";

const permissionGroups = [
  {
    name: "Menu",
    permissions: ["View", "Edit", "Delete"],
  },
  {
    name: "Orders",
    permissions: ["View", "Update status"],
  },
  {
    name: "Stock",
    permissions: ["View", "Edit"],
  },
  {
    name: "Tables",
    permissions: ["Manage"],
  },
  {
    name: "Users",
    permissions: ["Invite", "Manage"],
  },
];

interface RolePermissionProps {
  role: string;
}

export default function RolePermissionPage({ role }: RolePermissionProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    "Menu.View": true,
    "Menu.Edit": true,
    "Orders.View": true,
    "Orders.Update status": true,
    "Stock.View": true,
  });

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleGroup = (group: string, checked: boolean) => {
    const updated = { ...permissions };

    permissionGroups
      .find((g) => g.name === group)
      ?.permissions.forEach((p) => {
        updated[`${group}.${p}`] = checked;
      });

    setPermissions(updated);
  };

  return (
    <div className="space-y-6 flex h-[calc(100vh-180px)] flex-col">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between shrink-0 ">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{role}</h2>

            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              Custom
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">3 users assigned</p>
        </div>

        <button className=" text-sm rounded-lg border px-4 py-2 hover:bg-gray-50">
          Clone from
        </button>
      </div>

      {/* Permission Cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {permissionGroups.map((group) => {
          const allSelected = group.permissions.every(
            (p) => permissions[`${group.name}.${p}`],
          );

          return (
            <div
              key={group.name}
              className="rounded-xl border border-gray-200 bg-white p-4 mb-4 "
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className="mb-4 font-medium">{group.name}</h3>

                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {group.permissions.map((permission) => {
                      const key = `${group.name}.${permission}`;

                      return (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={permissions[key] || false}
                            onChange={() => togglePermission(key)}
                            className="h-3 w-3 rounded border-gray-300 text-indigo-600"
                          />

                          <span className="text-sm">{permission}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleGroup(group.name, e.target.checked)}
                    className="h-3 w-3 rounded border-gray-300 text-indigo-600"
                  />

                  <span className="text-sm">All</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 border-t bg-white p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">No changes</span>

          <div className="flex gap-3">
            <button className="rounded-lg border px-4 py-2">Discard</button>

            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
