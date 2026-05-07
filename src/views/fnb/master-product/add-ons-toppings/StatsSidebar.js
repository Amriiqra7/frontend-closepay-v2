'use client';

import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ArrowRight2, DocumentUpload, Edit2 } from 'iconsax-react';
import { PiForkKnifeFill } from 'react-icons/pi';
import SurfaceCard from '../../common/SurfaceCard';
import { fnbPalette, fnbTypography } from '../../common/styles';

export default function StatsSidebar() {
  return (
    <Stack spacing={3}>
      <SurfaceCard
        sx={{
          p: 3.5,
          borderRadius: 4,
          bgcolor: fnbPalette.primary,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 304,
        }}
      >
        <Typography sx={{ ...fnbTypography.sectionLabel, color: 'rgba(255,255,255,0.86)', fontSize: '0.8rem' }}>
          Master Stats
        </Typography>

        <Box sx={{ mt: 5 }}>
          <Typography sx={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: '#fff' }}>
            24
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.76)', fontSize: '0.98rem' }}>
            Total Add-On Groups
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: '#fff' }}>
            118
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.76)', fontSize: '0.98rem' }}>
            Individual Variations
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            right: -6,
            bottom: -18,
            color: 'rgba(255,255,255,0.1)',
            lineHeight: 1,
          }}
        >
          <PiForkKnifeFill size={136} />
        </Box>
      </SurfaceCard>

      <SurfaceCard
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: '#eceef1',
          border: '1px solid #e4e7eb',
        }}
      >
        <Typography sx={{ ...fnbTypography.sectionLabel, color: fnbPalette.textPrimary, fontSize: '0.8rem' }}>
          Bulk Actions
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          <Button
            variant="contained"
            startIcon={<Edit2 size={18} color="#111827" variant="Linear" />}
            endIcon={<ArrowRight2 size={16} color="#111827" variant="Linear" />}
            sx={{
              justifyContent: 'space-between',
              height: 58,
              borderRadius: 2.5,
              bgcolor: '#fff',
              color: '#111827',
              boxShadow: 'none',
              px: 2.5,
              '&:hover': { bgcolor: '#fff' },
              '& .MuiButton-startIcon, & .MuiButton-endIcon': { m: 0 },
            }}
          >
            Update Prices
          </Button>
          <Button
            variant="contained"
            startIcon={<DocumentUpload size={18} color="#111827" variant="Linear" />}
            endIcon={<ArrowRight2 size={16} color="#111827" variant="Linear" />}
            sx={{
              justifyContent: 'space-between',
              height: 58,
              borderRadius: 2.5,
              bgcolor: '#fff',
              color: '#111827',
              boxShadow: 'none',
              px: 2.5,
              '&:hover': { bgcolor: '#fff' },
              '& .MuiButton-startIcon, & .MuiButton-endIcon': { m: 0 },
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </SurfaceCard>
    </Stack>
  );
}
