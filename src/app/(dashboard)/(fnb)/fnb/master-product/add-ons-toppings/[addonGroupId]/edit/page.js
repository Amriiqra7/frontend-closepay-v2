import AddOnGroupForm from "@/views/fnb/master-product/add-ons-toppings/AddOnGroupForm";

export default async function FnbAddOnsToppingsEditRoute({ params }) {
  const resolvedParams = await params;
  return <AddOnGroupForm mode="edit" addonGroupId={resolvedParams?.addonGroupId} />;
}

