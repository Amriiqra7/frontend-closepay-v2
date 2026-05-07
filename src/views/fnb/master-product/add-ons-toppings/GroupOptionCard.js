'use client';

import React from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { More } from 'iconsax-react';
import SurfaceCard from '../../common/SurfaceCard';
import { fnbTypography } from '../../common/styles';

export default function GroupOptionCard({ group }) {
  const Icon = group.icon;

  return (
    <SurfaceCard
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 3,
              bgcolor: group.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={28} color={group.iconColor} variant="Bold" />
          </Box>
          <Box>
            <Typography sx={{ color: '#111827', fontSize: '1.1rem', fontWeight: 800 }}>
              {group.title}
            </Typography>
            <Typography sx={{ ...fnbTypography.sectionLabel, mt: 0.35, fontWeight: 600, letterSpacing: '0.08em' }}>
              {group.subtitle}
            </Typography>
          </Box>
        </Box>

        <Button variant="text" sx={{ minWidth: 28, width: 28, p: 0, color: '#6b7280' }}>
          <More size={18} color="#6b7280" variant="Bold" />
        </Button>
      </Box>

      <Stack spacing={1.5}>
        {group.options.map((option) => (
          <Paper
            key={option.name}
            elevation={0}
            sx={{
              px: 2.5,
              py: 2,
              borderRadius: 2.5,
              bgcolor: '#f7f8fa',
              border: '1px solid #f0f2f5',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                <Typography sx={{ color: '#111827', fontSize: '0.97rem', fontWeight: 600 }}>
                  {option.name}
                </Typography>
                {option.badge ? (
                  <Chip
                    label={option.badge}
                    size="small"
                    sx={{
                      height: 22,
                      bgcolor: '#ffd8d8',
                      color: '#b42318',
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      borderRadius: 1,
                      textTransform: 'uppercase',
                    }}
                  />
                ) : null}
              </Box>
              <Typography sx={{ color: '#155DFC', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>
                {option.price}
              </Typography>
            </Box>
          </Paper>
        ))}

        <Button
          variant="outlined"
          sx={{
            mt: 1,
            height: 56,
            borderRadius: 2.5,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: '#cfd8e3',
            color: '#6b7280',
            fontWeight: 700,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: '#b9c5d3',
              bgcolor: '#fafbfd',
            },
          }}
        >
          {group.addLabel}
        </Button>
      </Stack>
    </SurfaceCard>
  );
}
