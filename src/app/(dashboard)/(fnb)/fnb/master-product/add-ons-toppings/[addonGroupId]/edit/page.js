import AddOnsToppingsEditView from "@/views/fnb/master-product/AddOnsToppingsEditView";

export default async function FnbAddOnsToppingsEditRoute({ params }) {
  const resolvedParams = await params;
  return <AddOnsToppingsEditView addonGroupId={resolvedParams?.addonGroupId} />;
}

