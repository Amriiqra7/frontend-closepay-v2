'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

export default function WelcomeBanner() {
  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '130px',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: "url('/assets/images/bg-welcomebanner.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Chip
        label="E-Subsidi"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          left: 30,
          bgcolor: '#d32f2f',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.7rem',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          Selamat Datang, Team E Subsidi Bangka Belitung
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.5,
          }}
        >
          Hari ini adalah hari yang baik!
        </Typography>
      </Box>
    </Box>
  );
}
