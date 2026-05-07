import InternalUserEditView from "@/views/fnb/master-product/InternalUserEditView";

export default async function FnbManajemenUserEditRoute({ params }) {
  const resolvedParams = await params;
  return <InternalUserEditView userId={resolvedParams?.userId} />;
}
