'use client';

import React from 'react';
import { Box, Button, Chip, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { ArrowRight2, Box1, Filter, More } from 'iconsax-react';
import { products } from './data';

export default function ProductList({ selectedProduct, onSelect }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 3,
        border: '1px solid #e8edf3',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.04)',
        position: { xl: 'sticky' },
        top: { xl: 24 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.25 }}>
        <Typography sx={{ color: '#111827', fontSize: '1.12rem', fontWeight: 800 }}>
          Product List
        </Typography>
        <Stack direction="row" spacing={1}>
          <Filter size={18} color="#7b8794" variant="Linear" />
          <More size={18} color="#7b8794" variant="Linear" />
        </Stack>
      </Box>

      <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {products.map((product) => {
          const isSelected = selectedProduct === product.id;

          return (
            <ListItemButton
              key={product.id}
              onClick={() => onSelect(product.id)}
              sx={{
                p: 1.4,
                borderRadius: 2.5,
                border: isSelected ? '2px solid #0d4f63' : '1px solid #eef2f6',
                bgcolor: '#fff',
                boxShadow: isSelected ? '0 8px 24px rgba(13, 79, 99, 0.12)' : 'none',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: '#eef4f7',
                  color: '#0d4f63',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Box1 size={22} color="#0d4f63" variant="Bold" />
              </Box>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: '0.96rem', lineHeight: 1.3 }}>
                        {product.name}
                      </Typography>
                      <Typography sx={{ mt: 0.45, color: '#6b7280', fontSize: '0.78rem' }}>
                        {product.category} - {product.price}
                      </Typography>
                    </Box>
                    <Chip
                      label={product.status}
                      size="small"
                      sx={{
                        height: 22,
                        bgcolor: `${product.tone}22`,
                        color: product.tone,
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                }
              />

              <ArrowRight2 size={16} color="#9aa5b1" variant="Linear" />
            </ListItemButton>
          );
        })}
      </List>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          mt: 2,
          height: 42,
          borderRadius: 2,
          borderStyle: 'dashed',
          borderColor: '#bfd5e1',
          color: '#0d4f63',
        }}
      >
        Load 24 More Products
      </Button>
    </Paper>
  );
}
