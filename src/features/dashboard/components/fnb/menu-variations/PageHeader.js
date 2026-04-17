'use client';

import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add, DocumentUpload } from 'iconsax-react';

export default function PageHeader({
  onBulkImport,
  onAddMenu,
  bulkImportLabel = 'Bulk Import',
  addMenuLabel = 'Add New Menu',
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          variant="outlined"
          onClick={onBulkImport}
          startIcon={<DocumentUpload size={18} color="#0f172a" variant="Linear" />}
          sx={{ minWidth: 120, height: 44, borderRadius: 2, borderColor: '#dbe3ec', color: '#0f172a', bgcolor: '#fff' }}
        >
          {bulkImportLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onAddMenu}
          startIcon={<Add size={18} color="#fff" variant="Linear" />}
          sx={{
            minWidth: 144,
            height: 44,
            borderRadius: 2,
            bgcolor: '#155DFC',
            boxShadow: '0 10px 24px rgba(13, 79, 99, 0.24)',
            '&:hover': { bgcolor: '#0d4fc7' },
          }}
        >
          {addMenuLabel}
        </Button>
      </Stack>
    </Box>
  );
}
