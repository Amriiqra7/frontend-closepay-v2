'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import MetricCard from './MetricCard';
import { expiredItems, overviewCards, stockChartOptions, stockChartSeries } from './data';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function FnbDashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        {overviewCards.map((card) => (
          <MetricCard key={card.title} card={card} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) minmax(320px, 0.95fr)' },
          gap: 2,
          alignItems: 'start',
          mb: 2,
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #edf1f5', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.04)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap', mb: 2.5 }}>
            <Box>
              <Typography sx={{ color: '#17212b', fontSize: '1.2rem', fontWeight: 800 }}>
                Stock Movement Trends
              </Typography>
              <Typography sx={{ color: '#8b97a4', fontSize: '0.86rem', mt: 0.5 }}>
                Weekly warehouse inflow and outflow
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip label="Inbound" size="small" sx={{ bgcolor: '#eef3f7', color: '#155DFC', fontWeight: 700 }} />
              <Chip label="Outbound" size="small" sx={{ bgcolor: '#f6f8fa', color: '#7c8793', fontWeight: 700 }} />
            </Stack>
          </Box>
          <Box sx={{ height: 320 }}>
            <Chart options={stockChartOptions} series={stockChartSeries} type="bar" height="100%" />
          </Box>
        </Paper>

        <Stack spacing={2}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #edf1f5', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ color: '#17212b', fontSize: '1.12rem', fontWeight: 800 }}>
                Recently Expired
              </Typography>
              <Typography sx={{ color: '#155DFC', fontWeight: 700, fontSize: '0.82rem' }}>
                View All
              </Typography>
            </Box>

            <Stack divider={<Divider flexItem />} spacing={0}>
              {expiredItems.map((item) => (
                <Box key={item.name} sx={{ py: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar variant="rounded" sx={{ width: 54, height: 54, bgcolor: '#1f2937', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>
                    FN
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ color: '#17212b', fontSize: '0.93rem', fontWeight: 700, lineHeight: 1.25 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: '#8b97a4', fontSize: '0.76rem', mt: 0.35 }}>
                      {item.meta}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#d14343', fontSize: '0.82rem', fontWeight: 800 }}>
                      Expired
                    </Typography>
                    <Typography sx={{ color: '#9aa5b1', fontSize: '0.72rem', mt: 0.35 }}>
                      {item.age}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: '1px solid #f4d0b0', bgcolor: '#fff0e2' }}>
            <Typography sx={{ color: '#9a5d18', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Inventory Loss Mitigation
            </Typography>
            <Typography sx={{ color: '#7c4a0e', fontSize: '0.88rem', mt: 0.8, lineHeight: 1.5 }}>
              System suggests moving 12 soon-to-expire items to distribution for outlet promotions.
            </Typography>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
