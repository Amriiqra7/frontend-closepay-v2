import MenuVariationsEditView from "@/views/fnb/master-product/MenuVariationsEditView";

export default async function FnbMenuVariationsEditRoute({ params }) {
  const resolvedParams = await params;
  return <MenuVariationsEditView menuId={resolvedParams?.menuId} />;
}
