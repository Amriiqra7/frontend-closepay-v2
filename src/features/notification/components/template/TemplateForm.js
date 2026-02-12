'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';

// Mock data untuk template key options
const mockTemplateKeys = [
  'BULK UPLOAD ADJUSTMENT ADMIN',
  'ACTIVATION ADMIN',
  'ACTIVATION MEMBER',
  'ACTIVATION MERCHANT',
  'ADD BANK ACCOUNT',
  'LMS UNBLOCKED',
  'CARD CARD PAYMENT GATEWAY',
];

export default function TemplateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('id');
  const isEdit = !!templateId;

  const [templateKey, setTemplateKey] = useState('');

  const handleSubmit = () => {
    // TODO: Implement API call to save/update
    console.log('Save template:', { templateKey, templateId });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
      {/* Left Section - Form */}
      <Box sx={{ flex: '0 0 400px' }}>
        <MainCard content={false}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Template Key
                <Typography component="span" sx={{ color: 'red', ml: 0.5 }}>
                  *
                </Typography>
              </Typography>
              <Select
                fullWidth
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                displayEmpty
                size="small"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Pilih</em>
                </MenuItem>
                {mockTemplateKeys.map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleBack}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                }}
              >
                Kembali
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!templateKey}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                }}
              >
                Tambah Template
              </Button>
            </Box>
          </Box>
        </MainCard>
      </Box>

      {/* Right Section - Template Display */}
      <Box sx={{ flex: 1 }}>
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: 'white',
              borderBottom: '1px solid rgba(232, 235, 238, 1)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              TAMPILAN TEMPLATE
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: 'rgba(248, 249, 250, 1)',
              p: 3,
            }}
          >
            {/* Template preview akan ditampilkan di sini */}
            <Typography variant="body2" color="text.secondary" align="center">
              Pilih template key untuk melihat preview
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
