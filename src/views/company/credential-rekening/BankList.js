'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

export default function BankList({ banks, selectedBank, onBankClick }) {
  if (!banks || banks.length === 0) {
    return null;
  }

  return (
    <Grid item xs={12} md={4}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          height: '100%',
        }}
      >
        {banks.map((item) => (
          <Card
            key={item.id}
            onClick={() => onBankClick(item)}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: '1px solid',
              borderColor: selectedBank?.id === item.id ? '#155DFC' : 'rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              boxShadow: 'none',
              bgcolor: selectedBank?.id === item.id ? 'rgba(21, 93, 252, 0.04)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(21, 93, 252, 0.08)',
                borderColor: '#155DFC',
                transform: 'translateX(4px)',
                boxShadow: '0 2px 8px rgba(21, 93, 252, 0.15)',
              },
            }}
          >
            <CardContent
              sx={{
                p: 2,
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 80,
                '&:last-child': {
                  pb: 2.5,
                },
              }}
            >
              {item.logo ? (
                <Box
                  component="img"
                  src={item.logo}
                  alt={item.name}
                  sx={{
                    width: 120,
                    height: 50,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    color: selectedBank?.id === item.id ? '#155DFC' : 'text.primary',
                    fontSize: '0.875rem',
                  }}
                >
                  {item.name}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Grid>
  );
}
