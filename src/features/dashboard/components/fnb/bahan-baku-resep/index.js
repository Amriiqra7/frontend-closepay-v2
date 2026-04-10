'use client';

import React from 'react';
import { Box } from '@mui/material';
import DocumentationCard from './DocumentationCard';
import HeroSection from './HeroSection';
import IngredientsTableCard from './IngredientsTableCard';
import RecipeStepsCard from './RecipeStepsCard';
import SelectedMenuCard from './SelectedMenuCard';

export default function FnbBahanBakuResepPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HeroSection />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '280px minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'start',
          mb: 2
        }}
      >
        <Box sx={{ display: 'grid', gap: 3 }}>
          <SelectedMenuCard />
          <DocumentationCard />
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          <IngredientsTableCard />
          <RecipeStepsCard />
        </Box>
      </Box>
    </Box>
  );
}
