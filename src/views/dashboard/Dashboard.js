'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import WelcomeBanner from './WelcomeBanner';
import AnalyticsCards from './AnalyticsCards';
import TransactionFilters from './TransactionFilters';
import AnalyticsChart from './AnalyticsChart';

export default function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      
      <Box sx={{ mt: 4, width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
          Analisis performa
        </Typography>
        <AnalyticsCards />
      </Box>

      <Box sx={{ mt: 4, width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
          Transaksi Dan Pemesanan
        </Typography>
        <TransactionFilters />
      </Box>

      <Box sx={{ mt: 4, width: '100%' }}>
        <AnalyticsChart />
      </Box>
    </>
  );
}
