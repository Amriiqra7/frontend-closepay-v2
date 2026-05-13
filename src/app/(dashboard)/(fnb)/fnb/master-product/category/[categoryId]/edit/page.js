import CategoryForm from "@/views/fnb/master-product/category/CategoryForm";

export default async function FnbCategoryEditPage({ params }) {
  const resolvedParams = await params;
  return <CategoryForm mode="edit" categoryId={resolvedParams?.categoryId} />;
}
