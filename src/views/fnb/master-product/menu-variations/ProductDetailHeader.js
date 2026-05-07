'use client';

import React from 'react';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { PiForkKnifeFill } from 'react-icons/pi';

export default function ProductDetailHeader({
  title = 'Artisan Green Salad',
  productId = 'SKU-CUL-00812',
  onPrimaryAction,
  primaryLabel = 'Edit',
}) {
  return (
    <Box
      sx={{
        p: { xs: 2.25, md: 2.5 },
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar
          variant="rounded"
          sx={{ width: 56, height: 56, bgcolor: '#f0f4ff', color: '#155DFC' }}
        >
          <PiForkKnifeFill size={30} />
        </Avatar>

        <Box>
          <Typography
            sx={{
              color: '#111827',
              fontSize: { xs: '1.45rem', md: '1.95rem' },
              fontWeight: 800,
              lineHeight: 1.08,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mt: 0.55, color: '#6b7280', fontSize: '0.88rem' }}>
            Product ID: {productId}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1.25} alignItems="center">
        <Button
          variant="contained"
          type="button"
          onClick={onPrimaryAction}
          sx={{ minWidth: 132, height: 46, borderRadius: 2, bgcolor: '#155DFC', '&:hover': { bgcolor: '#0d4fc7' } }}
        >
          {primaryLabel}
        </Button>
      </Stack>
    </Box>
  );
}
