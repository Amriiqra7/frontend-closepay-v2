import RoleList from "@/features/role/components/data-role/RoleList";

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function DataRoleListPage() {
  return <RoleList />;
}
