import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function Orders() {
  return (
    <>
      <PageMeta
        title="Redor Orders page"
        description="This is Orders page that contains all orders"
      />
      <PageBreadcrumb pageTitle="Orders" />
      <div className="space-y-6">
        <ComponentCard title="Orders List">Orders Page works</ComponentCard>
      </div>
    </>
  );
}
