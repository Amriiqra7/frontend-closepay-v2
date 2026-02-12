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
      
      <Box sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Analisis performa
        </Typography>
        <AnalyticsCards />
      </Box>

      <Box sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Transaksi Dan Pemesanan
        </Typography>
        <TransactionFilters />
      </Box>

      <Box sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
        <AnalyticsChart />
      </Box>
    </>
  );
}
