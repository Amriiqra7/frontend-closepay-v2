'use client';

import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { ArrowUp2 } from 'iconsax-react';

export default function MetricCard({ card }) {
  const Icon = card.icon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #edf1f5',
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 178,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 20,
          bottom: 20,
          width: 4,
          borderRadius: 999,
          backgroundColor: card.borderLeft,
          opacity: card.borderLeft === 'transparent' ? 0 : 1,
        },
      }}
    >
      <Stack spacing={2.25} sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: card.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} color={card.iconColor} variant="Bold" />
          </Box>
          {card.badge ? (
            <Chip
              label={card.badge}
              size="small"
              sx={{
                height: 22,
                bgcolor: '#e6f7f5',
                color: card.badgeColor,
                fontWeight: 700,
                fontSize: '0.625rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            />
          ) : null}
        </Box>

        <Box>
          <Typography sx={{ color: '#7b8794', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
            {card.title}
          </Typography>
          <Typography sx={{ color: '#111827', fontSize: { xs: '1.9rem', md: '2.1rem' }, fontWeight: 800, lineHeight: 1, mb: 1.25 }}>
            {card.value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {card.note.startsWith('+') ? <ArrowUp2 size={15} color={card.accent} variant="Bold" /> : null}
            <Typography sx={{ color: card.accent, fontSize: '0.8rem', fontWeight: 700 }}>
              {card.note}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
