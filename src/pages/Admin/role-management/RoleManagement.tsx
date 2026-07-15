import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";

export default function RoleManagement() {
  return (
    <>
      <PageMeta title="Role Management" description="Role management section" />
      <PageBreadcrumb pageTitle="Role Mangement" />
      <div className="space-y-6">
        <ComponentCard title="Roles">Role Manaagement Page works</ComponentCard>
      </div>
    </>
  );
}
