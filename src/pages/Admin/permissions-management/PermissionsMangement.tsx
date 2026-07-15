import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";

export default function PermissionsManagement() {
  return (
    <>
      <PageMeta
        title="Permissions Management"
        description="Permissions management section"
      />
      <PageBreadcrumb pageTitle="Permissions Mangement" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          Permissions Manaagement Page works
        </ComponentCard>
      </div>
    </>
  );
}
