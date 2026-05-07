'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Add, ArrowRight2, Box1 } from 'iconsax-react';
import { ingredients } from './data';
import SurfaceCard from '../../common/SurfaceCard';
import { fnbTypography } from '../../common/styles';

export default function FnbBahanBakuResepPage() {
  const [selectedIngredientId, setSelectedIngredientId] = useState(ingredients[0]?.id ?? '');

  const selectedIngredient = useMemo(
    () => ingredients.find((item) => item.id === selectedIngredientId) ?? ingredients[0],
    [selectedIngredientId]
  );

  const detailItems = [
    { label: 'ID Bahan', value: selectedIngredient?.id ?? '-' },
    { label: 'Nama Bahan', value: selectedIngredient?.name ?? '-' },
    { label: 'Kebutuhan Per Porsi', value: selectedIngredient ? `${selectedIngredient.quantity} ${selectedIngredient.unit}` : '-' },
    { label: 'Status Stok', value: 'Available' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={Link}
          href="/fnb/master-product/bahan-baku-resep/new"
          variant="contained"
          endIcon={<Add size={20} color="#fff" variant="Linear" />}
          sx={{ borderRadius: 2, px: 2.25, height: 42, fontWeight: 700, boxShadow: 'none' }}
        >
          Add Bahan Baku & Resep
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '380px minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'start',
          mb: 2,
        }}
      >
        <SurfaceCard sx={{ p: 2.5 }}>
          <Typography sx={fnbTypography.sectionLabel}>Ingredient Detail</Typography>
          <Typography sx={{ mt: 0.65, color: '#111827', fontSize: '1.08rem', fontWeight: 800 }}>
            {selectedIngredient?.name ?? '-'}
          </Typography>

          <Stack spacing={1.25} sx={{ mt: 2 }}>
            {detailItems.map((item) => (
              <Paper key={item.label} elevation={0} sx={{ p: 1.4, borderRadius: 1.8, border: '1px solid #edf1f5', bgcolor: '#f8fafc' }}>
                <Typography sx={{ ...fnbTypography.sectionLabel, color: '#6b7280' }}>{item.label}</Typography>
                <Typography sx={{ mt: 0.45, color: '#111827', fontSize: '0.93rem', fontWeight: 700 }}>{item.value}</Typography>
              </Paper>
            ))}
          </Stack>
        </SurfaceCard>

        <SurfaceCard sx={{ p: 2.5 }}>
          <Typography sx={fnbTypography.sectionTitle}>Daftar Bahan Baku</Typography>
          <Typography sx={{ mt: 0.6, color: '#6b7280', fontSize: '0.86rem' }}>
            Klik salah satu bahan baku untuk melihat detail di panel kiri.
          </Typography>

          <Stack spacing={1.2} sx={{ mt: 2.2 }}>
            {ingredients.map((ingredient) => {
              const isSelected = selectedIngredientId === ingredient.id;
              return (
                <Paper
                  key={ingredient.id}
                  onClick={() => setSelectedIngredientId(ingredient.id)}
                  elevation={0}
                  sx={{
                    p: 1.6,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isSelected ? '#155DFC' : '#e5e7eb',
                    bgcolor: isSelected ? 'rgba(21, 93, 252, 0.08)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#155DFC', bgcolor: isSelected ? 'rgba(21, 93, 252, 0.1)' : '#f8fafc' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ color: '#111827', fontSize: '0.95rem', fontWeight: 700 }} noWrap>
                        {ingredient.name}
                      </Typography>
                      <Typography sx={{ mt: 0.45, color: '#6b7280', fontSize: '0.8rem' }}>
                        {ingredient.id}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, color: '#155DFC', flexShrink: 0 }}>
                      <Box1 size={16} color="#155DFC" variant="Bold" />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
                        {ingredient.quantity} {ingredient.unit}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        </SurfaceCard>
      </Box>
    </Box>
  );
}
