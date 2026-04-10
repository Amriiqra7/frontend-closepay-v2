import Login from "@/features/authentication/components/Login";

export default async function LoginPrefixPage({ params }) {
  const resolvedParams = await params;

  return <Login initialPrefix={resolvedParams?.prefix || ""} />;
}
