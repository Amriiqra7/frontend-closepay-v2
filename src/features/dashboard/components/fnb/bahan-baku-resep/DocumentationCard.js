'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { documentationCard, menuMeta } from './data';
import ImagePlaceholder from '../common/ImagePlaceholder';
import SurfaceCard from '../common/SurfaceCard';
import { fnbTypography } from '../common/styles';

export default function DocumentationCard() {
  return (
    <SurfaceCard sx={{ p: 3 }}>
      <Typography sx={{ color: '#111827', fontSize: '1rem', fontWeight: 800, lineHeight: 1.45 }}>
        {documentationCard.title}
      </Typography>

      <Box sx={{ mt: 2.2 }}>
        <ImagePlaceholder height={180} />
      </Box>

      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center' }}>
        <Typography sx={fnbTypography.sectionLabel}>
          {documentationCard.caption}
        </Typography>
        <Typography sx={{ color: '#111827', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {menuMeta.updatedAt}
        </Typography>
      </Box>
    </SurfaceCard>
  );
}
