import KioskForm from "@/views/fnb/master-product/manajemen-kiosk/KioskForm";

export default async function FnbManajemenKioskEditPage({ params }) {
  const resolvedParams = await params;
  return <KioskForm mode="edit" kioskId={resolvedParams?.kioskId} />;
}
