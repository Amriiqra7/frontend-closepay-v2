'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add, DocumentText1 } from 'iconsax-react';
import { recipeSteps } from './data';
import ImagePlaceholder from '../common/ImagePlaceholder';
import SurfaceCard from '../common/SurfaceCard';
import { fnbTypography } from '../common/styles';

function StepMedia({ media }) {
  if (media.type === 'placeholder') {
    return <ImagePlaceholder height={128} title={media.label} subtitle="" />;
  }

  return <ImagePlaceholder height={128} subtitle="" />;
}

function StepItem({ step, last }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '42px minmax(0, 1fr)', gap: 1.5, position: 'relative' }}>
      {!last ? (
        <Box
          sx={{
            position: 'absolute',
            left: 20,
            top: 42,
            bottom: -28,
            width: 2,
            bgcolor: '#e6edf4',
          }}
        />
      ) : null}

      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 1.5,
          bgcolor: '#0d4f63',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1rem',
          zIndex: 1,
        }}
      >
        {step.number}
      </Box>

      <Box sx={{ pb: last ? 0 : 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ color: '#111827', fontSize: '1.05rem', fontWeight: 800 }}>
            {step.title}
          </Typography>
          <Box sx={{ px: 1.6, py: 0.45, borderRadius: 999, bgcolor: '#b9e5fb', color: '#0d4f63', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {step.duration}
          </Box>
        </Box>

        <Typography sx={{ mt: 1.25, color: '#374151', fontSize: '0.98rem', lineHeight: 1.75 }}>
          {step.description}
        </Typography>

        {step.media.length ? (
          <Box sx={{ mt: 2.2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${step.media.length}, minmax(0, 1fr))` }, gap: 1.5 }}>
            {step.media.map((media, index) => (
              <StepMedia key={`${step.number}-${index}`} media={media} />
            ))}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default function RecipeStepsCard() {
  return (
    <SurfaceCard sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <Typography sx={fnbTypography.sectionTitle}>
          Cara Memasak
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<DocumentText1 size={16} color="#111827" variant="Linear" />}
            sx={{ height: 38, borderRadius: 1.5, bgcolor: '#f3f4f6', color: '#111827', boxShadow: 'none', '&:hover': { bgcolor: '#eceff3', boxShadow: 'none' } }}
          >
            Print SOP
          </Button>
          <Button
            variant="contained"
            startIcon={<Add size={16} color="#fff" variant="Bold" />}
            sx={{ height: 38, borderRadius: 1.5, bgcolor: '#0d4f63', boxShadow: 'none', '&:hover': { bgcolor: '#0a4354', boxShadow: 'none' } }}
          >
            New Step
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 4 }}>
        {recipeSteps.map((step, index) => (
          <StepItem key={step.number} step={step} last={index === recipeSteps.length - 1} />
        ))}
      </Box>
    </SurfaceCard>
  );
}
