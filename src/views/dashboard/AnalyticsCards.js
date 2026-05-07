'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Chip,
} from '@mui/material';
import { ArrowUp2, ArrowDown2, TrendUp, Activity, Flash, Chart2 } from 'iconsax-react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const performanceMetrics = [
  {
    title: 'Total Pengguna',
    value: '12.400',
    previousValue: '11.273',
    change: '+10%',
    trend: 'up',
    score: 85,
    color: '#1976d2',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    icon: Activity,
    target: 15000,
  },
  {
    title: 'Merchant Aktif',
    value: '125',
    previousValue: '120',
    change: '+4.2%',
    trend: 'up',
    score: 78,
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
    icon: Chart2,
    target: 150,
  },
  {
    title: 'Volume Transaksi',
    value: 'Rp 2.450M',
    previousValue: 'Rp 2.200M',
    change: '+11.4%',
    trend: 'up',
    score: 92,
    color: '#ed6c02',
    gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
    icon: TrendUp,
    target: 3000000000,
  },
  {
    title: 'Volume BBM',
    value: '4.500 L',
    previousValue: '4.100 L',
    change: '+9.8%',
    trend: 'up',
    score: 88,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
    icon: Flash,
    target: 6000,
  },
];

const performanceData = {
  categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  series: [
    {
      name: 'Performa',
      data: [65, 72, 78, 85, 82, 88, 92],
    },
  ],
};

export default function AnalyticsCards() {
  const miniChartOptions = {
    chart: {
      type: 'area',
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ['#1976d2'],
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, md: 1.5 },
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          width: '100%',
        }}
      >
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const progress = (metric.score / 100) * 100;

          return (
            <Box
              key={index}
              sx={{
                flex: { 
                  xs: '1 1 100%', 
                  sm: '1 1 calc(50% - 6px)', 
                  md: '1' 
                },
                minWidth: 0,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Gradient Background Accent */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: metric.gradient,
                  }}
                />

                <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 0.75,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, pr: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          mb: 0.25,
                          lineHeight: 1.2,
                        }}
                      >
                        {metric.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#000',
                          fontSize: '1rem',
                          lineHeight: 1.2,
                        }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1.5,
                        background: `${metric.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size="14" color={metric.color} variant="Bold" />
                    </Box>
                  </Box>

                  {/* Performance Score */}
                  <Box sx={{ mb: 0.75 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.25,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#666',
                          fontSize: '0.625rem',
                          fontWeight: 500,
                        }}
                      >
                        Skor Performa
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: metric.color,
                          fontSize: '0.688rem',
                          fontWeight: 700,
                        }}
                      >
                        {metric.score}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 2,
                          background: metric.gradient,
                        },
                      }}
                    />
                  </Box>

                  {/* Trend Indicator */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pt: 0.75,
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flex: 1, minWidth: 0 }}>
                      {metric.trend === 'up' ? (
                        <ArrowUp2 size="12" color={metric.color} variant="Bold" />
                      ) : (
                        <ArrowDown2 size="12" color="#d32f2f" variant="Bold" />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: metric.trend === 'up' ? metric.color : '#d32f2f',
                          fontWeight: 600,
                          fontSize: '0.688rem',
                        }}
                      >
                        {metric.change}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${metric.score}%`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        backgroundColor: `${metric.color}15`,
                        color: metric.color,
                        '& .MuiChip-label': {
                          px: 0.5,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Overall Performance Summary */}
      <Card
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#ffffff',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Ringkasan Performa Keseluruhan
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 2,
                }}
              >
                Analisis performa menunjukkan tren positif dengan peningkatan konsisten
                di semua metrik utama.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    86%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    Rata-rata Skor
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    +9.1%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    Pertumbuhan Rata-rata
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: 200 }}>
                <Chart
                  options={{
                    chart: {
                      type: 'line',
                      toolbar: { show: false },
                      fontFamily: 'inherit',
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 3,
                    },
                    colors: ['#ffffff'],
                    xaxis: {
                      categories: performanceData.categories,
                      labels: {
                        style: {
                          colors: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                        },
                      },
                    },
                    yaxis: {
                      labels: {
                        style: {
                          colors: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                        },
                        formatter: (val) => `${val}%`,
                      },
                    },
                    grid: {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    tooltip: {
                      theme: 'dark',
                    },
                  }}
                  series={performanceData.series}
                  type="line"
                  height={200}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
