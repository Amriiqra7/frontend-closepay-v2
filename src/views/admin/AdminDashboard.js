'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from '@/components/MainCard';

export default function AdminDashboard({ title = 'Admin Dashboard' }) {
  return (
    <MainCard content={false}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Halaman admin dashboard untuk {title}
        </Typography>
      </Box>
    </MainCard>
  );
}
