'use client';

import React from 'react';
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Edit2, TickCircle } from 'iconsax-react';
import SurfaceCard from '../common/SurfaceCard';

const labelSx = {
  mb: 0.85,
  color: '#6b7280',
  fontSize: '0.74rem',
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 50,
    bgcolor: '#f3f4f6',
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: '#f3f4f6',
    },
    '&:hover fieldset': {
      borderColor: '#d8dde6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#155DFC',
    },
  },
  '& .MuiInputBase-input': {
    color: '#4b5563',
    fontSize: '0.875rem',
  },
};

export default function StockOpnameForm() {
  return (
    <SurfaceCard sx={{ p: { xs: 2.25, md: 3.5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mb: 3.5, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ color: '#0d3d5d', fontSize: { xs: '1.7rem', md: '2rem' }, fontWeight: 800, lineHeight: 1.08 }}>
            Create Stock Opname Report
          </Typography>
          <Typography sx={{ mt: 1, color: '#6b7280', fontSize: '1rem', lineHeight: 1.5 }}>
            Record physical stock count and update inventory valuation.
          </Typography>
        </Box>

        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: 2.5,
            bgcolor: '#f0f4ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Edit2 size={24} color="#155DFC" variant="Bold" />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr)' }, gap: 3, mb: 3 }}>
        <Box>
          <Typography sx={labelSx}>Item ID</Typography>
          <TextField fullWidth size="small" placeholder="e.g. SKU-10293" sx={fieldSx} />
        </Box>
        <Box>
          <Typography sx={labelSx}>Name</Typography>
          <TextField fullWidth size="small" placeholder="Enter product name" sx={fieldSx} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 220px 220px' }, gap: 3, mb: 3 }}>
        <Box>
          <Typography sx={labelSx}>Qty</Typography>
          <TextField fullWidth size="small" value="0.00" sx={fieldSx} />
        </Box>
        <Box>
          <Typography sx={labelSx}>Unit</Typography>
          <TextField select fullWidth size="small" value="Kg" sx={fieldSx}>
            <MenuItem value="Kg">Kg</MenuItem>
            <MenuItem value="Gr">Gr</MenuItem>
            <MenuItem value="Ltr">Ltr</MenuItem>
          </TextField>
        </Box>
        <Box>
          <Typography sx={labelSx}>Update Date</Typography>
          <TextField fullWidth size="small" placeholder="mm/dd/yyyy" sx={fieldSx} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 220px' }, gap: 3, mb: 3.5 }}>
        <Box>
          <Typography sx={labelSx}>Latest Price</Typography>
          <TextField
            fullWidth
            size="small"
            value="0.00"
            sx={fieldSx}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Box>
        <Box>
          <Typography sx={labelSx}>Expired Date</Typography>
          <TextField fullWidth size="small" placeholder="mm/dd/yyyy" sx={fieldSx} />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography sx={labelSx}>Description</Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Notes about the current stock condition..."
          sx={{
            ...fieldSx,
            '& .MuiOutlinedInput-root': {
              ...fieldSx['& .MuiOutlinedInput-root'],
              height: 'auto',
              alignItems: 'flex-start',
              py: 0.75,
            },
          }}
        />
      </Box>

      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
        <Button
          variant="text"
          sx={{
            minWidth: 120,
            height: 50,
            color: '#0f172a',
            fontSize: '0.95rem',
            fontWeight: 700,
          }}
        >
          Discard
        </Button>
        <Button
          variant="contained"
          startIcon={<TickCircle size={18} color="#fff" variant="Bold" />}
          sx={{
            minWidth: 188,
            height: 50,
            borderRadius: 2,
            bgcolor: '#155DFC',
            boxShadow: '0 14px 28px rgba(13, 79, 99, 0.22)',
            fontSize: '0.95rem',
            fontWeight: 800,
            '&:hover': {
              bgcolor: '#0d4fc7',
            },
          }}
        >
          Submit Report
        </Button>
      </Stack>
    </SurfaceCard>
  );
}
