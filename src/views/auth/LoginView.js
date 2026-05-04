import Login from "@/features/authentication/components/Login";

export default function LoginView({ initialPrefix = "" }) {
  return <Login initialPrefix={initialPrefix} />;
}
