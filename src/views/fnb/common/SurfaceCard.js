'use client';

import React from 'react';
import { Paper } from '@mui/material';
import { fnbCardSx } from './styles';

export default function SurfaceCard({ sx, children, ...props }) {
  return (
    <Paper elevation={0} sx={{ ...fnbCardSx, ...sx }} {...props}>
      {children}
    </Paper>
  );
}
