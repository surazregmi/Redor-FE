import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";

export default function TenantPlans() {
  return (
    <>
      <PageMeta
        title="Tenant plans Management"
        description="Tenant plan management section"
      />
      <PageBreadcrumb pageTitle="Tenant Plans Mangement" />
      <div className="space-y-6">
        <ComponentCard title="Tenant Plans">
          Tenant plans Manaagement Page works
        </ComponentCard>
      </div>
    </>
  );
}
