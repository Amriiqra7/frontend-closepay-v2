import LoginPageView from "@/views/auth/LoginPage";

export default async function LoginPrefixPage({ params }) {
  const resolvedParams = await params;

  return <LoginPageView initialPrefix={resolvedParams?.prefix || ""} />;
}
