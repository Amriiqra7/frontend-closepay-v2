'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';

const generateMockCompany = (id) => {
  const sampleData = [{ nama: 'Bougenvile Blok' }, { nama: 'Kantin FKi 12' }];
  const companyId = parseInt(id);
  const baseData = sampleData[(companyId - 1) % sampleData.length];
  const nama = companyId <= sampleData.length ? baseData.nama : `${baseData.nama} ${Math.floor(companyId / sampleData.length)}`;
  return { id: companyId, nama };
};

const CompanyAPI = {
  getById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockCompany(id)), 100);
    });
  },
};

export default function CompanyKonfigurasiKustomNamaPengirimEmail() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const [companyName, setCompanyName] = useState(companyId || 'Perusahaan');
  const [isEditMode, setIsEditMode] = useState(false);
  const [namaPengirim, setNamaPengirim] = useState('');

  useEffect(() => {
    if (companyId && !isNaN(companyId)) {
      CompanyAPI.getById(companyId).then((data) => setCompanyName(data.nama || companyId)).catch(() => setCompanyName(companyId));
    }
  }, [companyId]);

  const handleUbah = () => setIsEditMode(true);
  const handleBatal = () => setIsEditMode(false);
  const handleSimpan = () => {
    console.log('Saving konfigurasi kustom nama pengirim email:', { companyId, namaPengirim });
    setIsEditMode(false);
  };
  const handleKembali = () => router.back();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Atur Konfigurasi Kustom Nama Pengirim Email <strong>{companyName}</strong>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={namaPengirim}
              onChange={(e) => setNamaPengirim(e.target.value)}
              placeholder="Masukkan nama pengirim email"
              disabled={!isEditMode}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
            {!isEditMode ? (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pt: 1 }}>
                <Button variant="outlined" onClick={handleKembali} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
                  Kembali
                </Button>
                <Button variant="contained" onClick={handleUbah} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                  Atur
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pt: 1 }}>
                <Button variant="outlined" onClick={handleBatal} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
                  Batal
                </Button>
                <Button variant="contained" onClick={handleSimpan} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                  Simpan
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
