'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, FormControlLabel, Switch, Grid } from '@mui/material';
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

export default function CompanyKonfigurasiAkunInduk() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const [companyName, setCompanyName] = useState(companyId || 'Perusahaan');
  const [isEditMode1, setIsEditMode1] = useState(false);
  const [isEditMode2, setIsEditMode2] = useState(false);
  const [akunIndukMember, setAkunIndukMember] = useState(false);
  const [penambahanAkunIndukMember, setPenambahanAkunIndukMember] = useState(false);

  useEffect(() => {
    if (companyId && !isNaN(companyId)) {
      CompanyAPI.getById(companyId).then((data) => setCompanyName(data.nama || companyId)).catch(() => setCompanyName(companyId));
    }
  }, [companyId]);

  const handleUbah1 = () => setIsEditMode1(true);
  const handleBatal1 = () => setIsEditMode1(false);
  const handleSimpan1 = () => {
    console.log('Saving konfigurasi akun induk member:', { companyId, akunIndukMember });
    setIsEditMode1(false);
  };

  const handleUbah2 = () => setIsEditMode2(true);
  const handleBatal2 = () => setIsEditMode2(false);
  const handleSimpan2 = () => {
    console.log('Saving konfigurasi penambahan akun induk member:', { companyId, penambahanAkunIndukMember });
    setIsEditMode2(false);
  };

  const handleKembali = () => router.back();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 2, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Atur konfigurasi akun induk member pada perusahaan <strong>{companyName}</strong>
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={akunIndukMember}
                      onChange={(e) => setAkunIndukMember(e.target.checked)}
                      disabled={!isEditMode1}
                      color="primary"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#155DFC' },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{akunIndukMember ? 'Aktif' : 'Tidak Aktif'}</Typography>}
                />
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  {!isEditMode1 ? (
                    <Button variant="contained" onClick={handleUbah1} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                      Atur
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" onClick={handleBatal1} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
                        Batal
                      </Button>
                      <Button variant="contained" onClick={handleSimpan1} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                        Simpan
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 2, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Atur konfigurasi penambahan akun induk member pada perusahaan <strong>{companyName}</strong>
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={penambahanAkunIndukMember}
                      onChange={(e) => setPenambahanAkunIndukMember(e.target.checked)}
                      disabled={!isEditMode2}
                      color="primary"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#155DFC' },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{penambahanAkunIndukMember ? 'Aktif' : 'Tidak Aktif'}</Typography>}
                />
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  {!isEditMode2 ? (
                    <Button variant="contained" onClick={handleUbah2} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                      Atur
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" onClick={handleBatal2} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
                        Batal
                      </Button>
                      <Button variant="contained" onClick={handleSimpan2} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                        Simpan
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button variant="outlined" onClick={handleKembali} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
              Kembali
            </Button>
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
