'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { formatRupiah } from '@/shared/utils/format';
import TagihanTransaksionalTab from './TagihanTransaksionalTab';
import TagihanPenggunaanLayananTab from './TagihanPenggunaanLayananTab';

// Mock data untuk company
const mockCompanyData = {
  1: { id: 1, nama: 'DEMO QUALITY ASSURANCE' },
  'aggregator-xendit': { id: 'aggregator-xendit', nama: 'AGGREGATOR XENDIT' },
};

// Mock data tagihan transaksional
const mockTagihanData = {
  1: [
    {
      id: 1,
      bulanTagihan: 'Februari 2026',
      namaTagihan: 'Tagihan Bulanan',
      totalTagihan: 24000,
      sisaTagihan: 24000,
    },
    {
      id: 2,
      bulanTagihan: 'Januari 2026',
      namaTagihan: 'Tagihan Bulanan',
      totalTagihan: 600,
      sisaTagihan: 600,
    },
  ],
};

export default function TagihanPerusahaanList() {
  const params = useParams();
  const companyId = params?.companyId;
  const company = mockCompanyData[companyId] || { id: companyId, nama: 'Unknown Company' };

  const [activeTab, setActiveTab] = useState(0);

  // Mock data untuk overview
  const overviewData = useMemo(() => {
    const tagihanList = mockTagihanData[companyId] || [];
    const totalTagihanSaatIni = tagihanList.reduce((sum, item) => sum + item.sisaTagihan, 0);
    const totalTagihanTerbayarkan = tagihanList.reduce((sum, item) => sum + (item.totalTagihan - item.sisaTagihan), 0);
    return {
      totalTagihanSaatIni,
      totalTagihanTerbayarkan,
    };
  }, [companyId]);

  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', height: '100%', backgroundColor: '#f8f9fa' }}>
        {/* Banner */}
        <Alert
          severity="info"
          sx={{
            borderRadius: 0,
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            '& .MuiAlert-icon': {
              color: '#1976d2',
            },
          }}
        >
          Anda melihat data keuangan dari {company.nama}
        </Alert>

        {/* Overview Cards */}
        <Box sx={{ p: 2, backgroundColor: 'white' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
          >
            {/* Total Tagihan Saat Ini */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: 'none',
                height: '100%',
                boxShadow: 'none',
                bgcolor: '#fce4ec',
                position: 'relative',
              }}
            >
              <CardContent>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>
                    Total Tagihan Saat Ini
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.5rem', color: '#000' }}>
                    {formatCurrency(overviewData.totalTagihanSaatIni)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Total Tagihan Terbayarkan */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: 'none',
                height: '100%',
                boxShadow: 'none',
                bgcolor: '#e3f2fd',
                position: 'relative',
              }}
            >
              <CardContent>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>
                    Total Tagihan Terbayarkan
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.5rem', color: '#000' }}>
                    {formatCurrency(overviewData.totalTagihanTerbayarkan)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'white' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: '#666',
                px: 2,
                '&.Mui-selected': {
                  color: '#155DFC',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: '#155DFC',
              },
            }}
          >
            <Tab label="Tagihan Transaksional" value={0} />
            <Tab label="Tagihan Penggunaan Layanan" value={1} />
          </Tabs>
        </Box>

        {/* Content */}
        {activeTab === 0 ? (
          <TagihanTransaksionalTab companyId={companyId} />
        ) : (
          <TagihanPenggunaanLayananTab companyId={companyId} />
        )}
      </Box>

    </>
  );
}
