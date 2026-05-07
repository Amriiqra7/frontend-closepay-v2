'use client';

import React from 'react';
import { Button } from '@mui/material';
import { fnbPalette, fnbTypeScale } from '../../common/styles';

export default function ActionButton({ icon, children, dark = false, ...buttonProps }) {
  return (
    <Button
      variant={dark ? 'contained' : 'outlined'}
      startIcon={icon}
      sx={{
        minWidth: dark ? 192 : 120,
        height: 48,
        px: 2.5,
        borderRadius: 2,
        borderColor: dark ? fnbPalette.primary : '#e5e7eb',
        bgcolor: dark ? fnbPalette.primary : '#f9fafb',
        color: dark ? '#fff' : fnbPalette.textPrimary,
        boxShadow: 'none',
        fontSize: fnbTypeScale.control,
        lineHeight: 1.35,
        fontWeight: 700,
        '&:hover': {
          borderColor: dark ? fnbPalette.primaryDark : '#d1d5db',
          bgcolor: dark ? fnbPalette.primaryDark : '#f3f4f6',
        },
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
