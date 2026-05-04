import LoginView from "@/views/auth/LoginView";

export default async function LoginPrefixPage({ params }) {
  const resolvedParams = await params;

  return <LoginView initialPrefix={resolvedParams?.prefix || ""} />;
}
