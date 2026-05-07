'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamic import untuk menghindari SSR issues dengan ApexCharts
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AnalyticsChart() {
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['2025-06-2', '2025-06-2', '2025-06-2', '2025-06-2', '2025-06-2'],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val / 1000 + 'K';
        },
        style: {
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#1976d2', '#ed6c02', '#9c27b0', '#d32f2f', '#0097a7'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString('id-ID');
        },
      },
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 3,
    },
  };

  const chartSeries = [
    {
      name: 'Total Pengguna',
      data: [5000, 6000, 7000, 8000, 9000],
    },
    {
      name: 'Transaksi Pertalite',
      data: [4000, 5000, 6000, 7000, 8000],
    },
    {
      name: 'Transaksi Pertalite',
      data: [3000, 4000, 5000, 6000, 7000],
    },
    {
      name: 'Transaksi Solar',
      data: [2000, 3000, 4000, 5000, 6000],
    },
    {
      name: 'Volume BBM',
      data: [4500, 5500, 6500, 7500, 8500],
    },
  ];

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Grafik Analitik
          </Typography>
        </Box>
        
        <Box sx={{ height: { xs: 300, sm: 400 }, width: '100%', overflowX: 'auto' }}>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height="100%"
          />
        </Box>

        <Box sx={{ mt: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
          <Chip label="Total (82)" sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }} />
          <Chip label="Total Pengguna: 10.000" sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }} />
          <Chip label="Merchant Aktif: 124" sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }} />
          <Chip label="Pertalite: 20.000" sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }} />
          <Chip label="Solar: 20.000" sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }} />
          <Chip label="Volume BBM: 50.000" sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
