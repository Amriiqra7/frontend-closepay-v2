'use client';

import React from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Filter } from 'iconsax-react';
import SurfaceCard from '../common/SurfaceCard';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.875rem',
    bgcolor: '#fff',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
  },
};

export default function FilterBar() {
  return (
    <SurfaceCard sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(5, minmax(0, 1fr))' },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <TextField select size="small" value="all" sx={fieldSx}>
          <MenuItem value="all">All Locations</MenuItem>
        </TextField>
        <TextField size="small" placeholder="SKU or keyword..." sx={fieldSx} />
        <TextField size="small" placeholder="mm/dd/yyyy" sx={fieldSx} />
        <TextField size="small" placeholder="mm/dd/yyyy" sx={fieldSx} />
        <Button
          variant="contained"
          startIcon={<Filter size={18} color="#111827" variant="Linear" />}
          sx={{
            height: 40,
            borderRadius: 1.5,
            bgcolor: '#f3f4f6',
            color: '#111827',
            boxShadow: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            '&:hover': { bgcolor: '#eceff3', boxShadow: 'none' },
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </SurfaceCard>
  );
}
