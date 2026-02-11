import RoleList from "@/views/role/RoleList";

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function DataRoleListPage() {
  return <RoleList />;
}
