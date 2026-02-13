import UserMerchantEdit from '@/features/user-merchant/components/UserMerchantEdit';

export default function DataUserMerchantEditPage({ params }) {
  return <UserMerchantEdit id={params.id} />;
}
