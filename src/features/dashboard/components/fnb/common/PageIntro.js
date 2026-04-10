'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { fnbTypography } from './styles';

export default function PageIntro({ title, description, maxWidth = 720 }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Box sx={{ maxWidth }}>
        <Typography sx={fnbTypography.pageTitle}>{title}</Typography>
        {description ? <Typography sx={fnbTypography.pageDescription}>{description}</Typography> : null}
      </Box>
    </Box>
  );
}
