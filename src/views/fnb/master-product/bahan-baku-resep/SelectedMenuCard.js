'use client';

import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ArrowSwapHorizontal, Box1 } from 'iconsax-react';
import { menuMeta } from './data';
import SurfaceCard from '../../common/SurfaceCard';
import { fnbTypography } from '../../common/styles';

function MetaPanel({ label, value }) {
  return (
    <Paper elevation={0} sx={{ p: 1.6, borderRadius: 2, bgcolor: '#f5f7fa', border: '1px solid #eef2f6' }}>
      <Typography sx={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.75, color: '#111827', fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.5 }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function SelectedMenuCard() {
  return (
    <SurfaceCard sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 1.6, alignItems: 'flex-start', mb: 3 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 1.5,
            bgcolor: '#155DFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Box1 size={20} color="#fff" variant="Bold" />
        </Box>
        <Box>
          <Typography sx={fnbTypography.sectionLabel}>
            Selected Menu
          </Typography>
          <Typography sx={{ mt: 0.45, color: '#111827', fontSize: '1.12rem', fontWeight: 800, lineHeight: 1.4 }}>
            {menuMeta.title}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 1.6 }}>
        <MetaPanel label="SKU ID" value={menuMeta.sku} />
        <MetaPanel label="Category" value={menuMeta.category} />
      </Box>

      <Button
        variant="contained"
        startIcon={<ArrowSwapHorizontal size={18} color="#111827" variant="Linear" />}
        sx={{
          mt: 4,
          width: '100%',
          height: 44,
          borderRadius: 1.5,
          bgcolor: '#f3f4f6',
          color: '#111827',
          boxShadow: 'none',
          fontWeight: 700,
          '&:hover': { bgcolor: '#eceff3', boxShadow: 'none' },
        }}
      >
        Change Product
      </Button>
    </SurfaceCard>
  );
}
