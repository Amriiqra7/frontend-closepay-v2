import MerchantConfigurationDetailPage from "@/views/fnb/merchant-configuration/MerchantConfigurationDetailPage";

export default function ManajemenMejaPage() {
  return (
    <MerchantConfigurationDetailPage
      title="Manajemen Meja"
      description="Kelola kebutuhan QR meja untuk operasional dine in."
      items={[
        "Cetak kode QR meja (input jumlah meja terlebih dahulu)",
        "Tampilan list table seperti QR Code Retribusi V1",
        "Unduh QR per meja atau unduh semua",
      ]}
    />
  );
}
