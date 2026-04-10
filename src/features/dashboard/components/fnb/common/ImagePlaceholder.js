'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Gallery } from 'iconsax-react';
import { fnbPalette } from './styles';

export default function ImagePlaceholder({
  height = 180,
  title = 'No preview image',
  subtitle = 'Default placeholder for dummy content',
  dashed = true,
}) {
  return (
    <Box
      sx={{
        height,
        borderRadius: 2,
        border: dashed ? `1px dashed ${fnbPalette.placeholderBorder}` : 'none',
        bgcolor: fnbPalette.placeholderBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: '#e8f1f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Gallery size={30} color="#0d4f63" variant="Bold" />
      </Box>
      <Typography sx={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography sx={{ color: '#94a3b8', fontSize: '0.76rem' }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
