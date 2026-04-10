'use client';

import React from 'react';
import { Chip } from '@mui/material';

export default function StatusChip({ label, tone }) {
  const palette =
    tone === 'warning'
      ? { bg: '#ffd8bf', color: '#7c3f12' }
      : { bg: '#b9e5fb', color: '#0d4f63' };

  return (
    <Chip
      label={label.toUpperCase()}
      size="small"
      sx={{
        height: 28,
        minWidth: 108,
        bgcolor: palette.bg,
        color: palette.color,
        fontWeight: 800,
        fontSize: '0.72rem',
        borderRadius: 999,
        letterSpacing: '0.04em',
      }}
    />
  );
}
