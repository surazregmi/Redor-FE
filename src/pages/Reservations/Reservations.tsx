import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function Reservations() {
  return (
    <>
      <PageMeta
        title="Redor Reservation page"
        description="This is Reservation page that contains all Reservations"
      />
      <PageBreadcrumb pageTitle="Reservations" />
      <div className="space-y-6">
        <ComponentCard title="Reservation List">
          Reservations Page works
        </ComponentCard>
      </div>
    </>
  );
}
