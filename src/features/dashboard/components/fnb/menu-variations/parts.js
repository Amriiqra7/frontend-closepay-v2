'use client';

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { fnbTypography } from '../common/styles';

export function SectionTitle({ title, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, mb: 2.25, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ ...fnbTypography.sectionLabel, color: '#0f172a' }}>
          {title}
        </Typography>
      </Box>
      {action}
    </Box>
  );
}

export function StatCard({ card }) {
  const Icon = card.icon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #edf1f5',
        bgcolor: card.dark ? '#155DFC' : '#fff',
        color: card.dark ? '#fff' : '#111827',
        boxShadow: card.dark ? '0 12px 24px rgba(13, 79, 99, 0.24)' : '0 10px 30px rgba(15, 23, 42, 0.04)',
        minHeight: 132,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: card.dark ? 'rgba(255,255,255,0.12)' : card.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={card.dark ? '#fff' : card.tone} variant="Bold" />
        </Box>
        <Typography sx={{ color: card.dark ? '#ffffff' : card.tone, fontSize: '0.74rem', fontWeight: 700 }}>
          {card.hint}
        </Typography>
      </Box>

      <Typography sx={{ color: card.dark ? '#ffffff' : '#7b8794', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {card.dark ? 'Active Menus' : card.title}
      </Typography>
      <Typography sx={{ mt: 0.9, color: card.dark ? '#ffffff' : '#111827', fontSize: { xs: '1.9rem', md: '2.05rem' }, fontWeight: 800, lineHeight: 1 }}>
        {card.value}
      </Typography>

      {card.dark ? (
        <Box sx={{ mt: 2.5, height: 6, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.18)' }}>
          <Box sx={{ width: '78%', height: '100%', borderRadius: 999, bgcolor: '#d6e4ff' }} />
        </Box>
      ) : null}
    </Paper>
  );
}

export function SummaryMetric({ label, value, subtle, dark = false, accent = false }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        minHeight: 92,
        border: dark ? 'none' : accent ? '1px solid #82b1ff' : '1px solid #e5edf4',
        bgcolor: dark ? '#155DFC' : accent ? '#d6e4ff' : '#f7fafc',
        color: dark ? '#fff' : '#0f172a',
      }}
    >
      <Typography sx={{ color: dark ? '#ffffff' : accent ? '#1c448e' : '#7b8794', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 1, color: dark ? '#ffffff' : '#0f172a', fontSize: '1.65rem', fontWeight: 800 }}>
        {value}
      </Typography>
      {subtle ? (
        <Typography sx={{ mt: 0.35, fontSize: '0.78rem', color: dark ? '#ffffff' : '#6b7280' }}>
          {subtle}
        </Typography>
      ) : null}
    </Paper>
  );
}
