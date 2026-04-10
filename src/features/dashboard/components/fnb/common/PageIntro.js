'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { fnbTypography } from './styles';

export default function PageIntro({ title, description, chipLabel, maxWidth = 720 }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Box sx={{ maxWidth }}>
        <Typography sx={fnbTypography.pageTitle}>{title}</Typography>
        {description ? <Typography sx={fnbTypography.pageDescription}>{description}</Typography> : null}
      </Box>

      {chipLabel ? (
        <Chip
          label={chipLabel}
          sx={{
            mt: { xs: 0, md: 1.2 },
            px: 1.25,
            height: 34,
            borderRadius: 999,
            bgcolor: '#b9e5fb',
            color: '#0d4f63',
            fontWeight: 800,
            fontSize: '0.74rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        />
      ) : null}
    </Box>
  );
}
