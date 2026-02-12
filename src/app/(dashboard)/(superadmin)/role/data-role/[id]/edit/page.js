import RoleEdit from "@/features/role/components/data-role/RoleEdit";

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function DataRoleEditPage() {
  return <RoleEdit />;
}
