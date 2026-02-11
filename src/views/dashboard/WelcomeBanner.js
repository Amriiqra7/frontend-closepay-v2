'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

export default function WelcomeBanner() {
  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: "url('/assets/images/bg-welcomebanner.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
          maxWidth: '60%',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 400,
            lineHeight: 1.3,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Selamat Datang, Team E Subsidi Bangka Belitung
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.5,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          Hari ini adalah hari yang baik!
        </Typography>
      </Box>
    </Box>
  );
}
