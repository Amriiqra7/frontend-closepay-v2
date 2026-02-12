import RoleNew from "@/features/role/components/data-role/RoleNew";

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function DataRoleNewPage() {
    return <RoleNew />;
}
