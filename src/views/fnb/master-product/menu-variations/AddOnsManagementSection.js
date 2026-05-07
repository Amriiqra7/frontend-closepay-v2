'use client';

import React from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { SectionTitle } from './parts';

function AddOnGroupCard({ group }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: '1px solid #e8edf3',
        bgcolor: '#fafbfd',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
          gap: 1,
        }}
      >
        <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{group.title}</Typography>
        <Chip
          label={group.badge}
          size="small"
          sx={{
            bgcolor: '#f4f7ff',
            color: '#4a6672',
            fontWeight: 700,
            fontSize: '0.65rem',
          }}
        />
      </Box>

      <Stack spacing={1}>
        {group.items.map((item) => (
          <Paper
            key={item.name}
            elevation={0}
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: '#fff',
              border: '1px solid #eef2f6',
              minHeight: 72,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
              <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.92rem' }}>
                {item.name}
              </Typography>
              <Typography sx={{ color: '#155DFC', fontWeight: 700, flexShrink: 0 }}>
                {item.price}
              </Typography>
            </Box>
          </Paper>
        ))}

        <Button
          variant="outlined"
          sx={{
            borderStyle: 'dashed',
            borderColor: '#d3dde5',
            color: '#6b7280',
            borderRadius: 2,
          }}
        >
          + Add Option
        </Button>
      </Stack>
    </Paper>
  );
}

export default function AddOnsManagementSection({
  title = 'Add-Ons & Toppings Management',
  action,
  groups = [],
}) {
  return (
    <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
      <SectionTitle
        title={title}
        action={
          action ?? (
            <Typography sx={{ color: '#155DFC', fontSize: '0.8rem', fontWeight: 700 }}>
              Manage All Groups
            </Typography>
          )
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {groups.map((group) => (
          <AddOnGroupCard key={group.title} group={group} />
        ))}
      </Box>
    </Box>
  );
}
