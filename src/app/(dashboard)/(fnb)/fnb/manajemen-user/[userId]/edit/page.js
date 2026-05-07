import InternalUserForm from "@/views/fnb/master-product/internal-user/InternalUserForm";

export default async function FnbManajemenUserEditRoute({ params }) {
  const resolvedParams = await params;
  return <InternalUserForm mode="edit" userId={resolvedParams?.userId} />;
}
