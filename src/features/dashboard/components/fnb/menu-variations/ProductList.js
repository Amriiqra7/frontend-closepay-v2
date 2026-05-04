'use client';

import React from 'react';
import { Box, Chip, CircularProgress, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { ArrowRight2, Box1, Filter, More } from 'iconsax-react';

export default function ProductList({
  selectedProduct,
  onSelect,
  products = [],
  loading = false,
  loadingMore = false,
  hasMore = false,
  pageSize = 4,
  onReachEnd,
}) {
  const listScrollRef = React.useRef(null);

  const tryLoadNext = React.useCallback(() => {
    if (!hasMore || loadingMore || typeof onReachEnd !== 'function') return;
    const target = listScrollRef.current;
    if (!target) return;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (distanceToBottom <= 72) {
      onReachEnd();
    }
  }, [hasMore, loadingMore, onReachEnd]);

  const handleListScroll = React.useCallback(() => {
    tryLoadNext();
  }, [tryLoadNext]);

  React.useEffect(() => {
    // Re-check after new items rendered; important when scroll stays near bottom.
    tryLoadNext();
  }, [products.length, hasMore, loadingMore, tryLoadNext]);

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
        display: 'flex',
        flexDirection: 'column',
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

      <Box
        ref={listScrollRef}
        onScroll={handleListScroll}
        sx={{
          height: { xs: 'calc(100vh - 320px)', xl: 'calc(100vh - 240px)' },
          overflowY: 'auto',
          pr: 0.5,
          mr: -0.5,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 999 },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        }}
      >
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
                border: isSelected ? '2px solid #155DFC' : '1px solid #eef2f6',
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
                  bgcolor: '#f4f7ff',
                  color: '#155DFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Box1 size={22} color="#155DFC" variant="Bold" />
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

        {!loading && products.length === 0 ? (
          <Typography sx={{ mt: 2, color: '#6b7280', fontSize: '0.86rem' }}>Belum ada product.</Typography>
        ) : null}

        <Box sx={{ pt: 2 }}>
          {loadingMore ? (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 1 }}>
              <CircularProgress size={18} />
              <Typography sx={{ color: '#6b7280', fontSize: '0.82rem' }}>Memuat product lain...</Typography>
            </Stack>
          ) : hasMore ? (
            <Typography sx={{ textAlign: 'center', color: '#9aa5b1', fontSize: '0.78rem' }}>
              Scroll untuk memuat data berikutnya
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Paper>
  );
}
