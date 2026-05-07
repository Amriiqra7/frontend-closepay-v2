import EditMenuVariationPage from "@/views/fnb/master-product/menu-variations/EditMenuVariationPage";

export default async function FnbMenuVariationsEditRoute({ params }) {
  const resolvedParams = await params;
  return <EditMenuVariationPage menuId={resolvedParams?.menuId} />;
}
