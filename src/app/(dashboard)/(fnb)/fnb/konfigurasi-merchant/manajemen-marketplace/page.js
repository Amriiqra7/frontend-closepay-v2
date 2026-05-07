import MerchantConfigurationDetailPage from "@/features/dashboard/components/fnb/merchant-configuration/DetailPage";

export default function ManajemenMarketplacePage() {
  return (
    <MerchantConfigurationDetailPage
      title="Manajemen Marketplace"
      description="Kelola pengiriman dan pengaturan peninjauan pesanan merchant."
      items={[
        "Manajemen Pengiriman (pengiriman merchant dan ekspedisi)",
        "Aktifkan/Nonaktifkan Peninjauan Pesanan sebelum diproses kasir",
      ]}
    />
  );
}
