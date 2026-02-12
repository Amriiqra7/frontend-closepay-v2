'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function GlobalLoading({ message = 'Memuat...' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8f9fa',
        zIndex: 9999,
      }}
    >
      <CircularProgress size={56} thickness={4} />
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mt: 3, fontWeight: 400 }}
      >
        {message}
      </Typography>
    </Box>
  );
}
