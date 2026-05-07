import UserMerchantEdit from '@/views/user-merchant/UserMerchantEdit';

export default function DataUserMerchantEditPage({ params }) {
  return <UserMerchantEdit id={params.id} />;
}
