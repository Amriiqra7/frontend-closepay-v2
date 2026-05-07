'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';

// Helper function to generate mock company data (same as CompanyList.js and PageHeader.js)
const generateMockCompany = (id) => {
  const sampleData = [
    {
      nama: 'Bougenvile Blok',
      inisialPerusahaan: 'BB',
    },
    {
      nama: 'Kantin FKi 12',
      inisialPerusahaan: 'KF12',
    },
  ];
  
  const companyId = parseInt(id);
  const baseData = sampleData[(companyId - 1) % sampleData.length];
  
  const nama = companyId <= sampleData.length 
    ? baseData.nama 
    : `${baseData.nama} ${Math.floor(companyId / sampleData.length)}`;
  
  return {
    id: companyId,
    nama: nama,
  };
};

// Placeholder API - replace with actual API service
const CompanyAPI = {
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const company = generateMockCompany(id);
          resolve(company);
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  },
};

export default function CompanyPerizinanLoginUser() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const [companyName, setCompanyName] = useState(companyId || 'Perusahaan');

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    loginMember: false,
    loginMerchant: false,
  });

  // Fetch company name based on ID
  useEffect(() => {
    if (companyId && !isNaN(companyId)) {
      CompanyAPI.getById(companyId)
        .then((data) => {
          setCompanyName(data.nama || companyId);
        })
        .catch((err) => {
          // If error, use ID as fallback
          setCompanyName(companyId);
        });
    }
  }, [companyId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAtur = () => {
    setIsEditMode(true);
  };

  const handleBatal = () => {
    setIsEditMode(false);
    // TODO: Reset form data jika perlu
  };

  const handleSimpan = () => {
    console.log('Saving perizinan login user:', {
      companyId,
      formData,
    });
    setIsEditMode(false);
  };
  const handleKembali = () => router.back();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              {/* Label */}
              <Box>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Atur konfigurasi login pada perusahaan <strong>{companyName}</strong>
                </Typography>
              </Box>

              {/* Login Member Switch */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.loginMember}
                      onChange={(e) => handleChange('loginMember', e.target.checked)}
                      disabled={!isEditMode}
                      color="primary"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#155DFC',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#155DFC',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Login Member
                    </Typography>
                  }
                />
              </Box>

              {/* Login Merchant Switch */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.loginMerchant}
                      onChange={(e) => handleChange('loginMerchant', e.target.checked)}
                      disabled={!isEditMode}
                      color="primary"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#155DFC',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#155DFC',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Login Merchant
                    </Typography>
                  }
                />
              </Box>

              {/* Action Buttons */}
              {!isEditMode ? (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleKembali}
                    sx={{
                      textTransform: 'none',
                      color: 'error.main',
                      borderColor: 'error.main',
                      px: 3,
                      '&:hover': {
                        borderColor: 'error.main',
                        bgcolor: 'error.lighter',
                      },
                    }}
                  >
                    Kembali
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAtur}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#155DFC',
                      px: 3,
                      minWidth: 100,
                      '&:hover': {
                        bgcolor: '#0f4fc7',
                      },
                    }}
                  >
                    Atur
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBatal}
                    sx={{
                      textTransform: 'none',
                      color: 'error.main',
                      borderColor: 'error.main',
                      px: 3,
                      '&:hover': {
                        borderColor: 'error.main',
                        bgcolor: 'error.lighter',
                      },
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSimpan}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#155DFC',
                      px: 3,
                      '&:hover': {
                        bgcolor: '#0f4fc7',
                      },
                    }}
                  >
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
