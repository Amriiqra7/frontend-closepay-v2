'use client';

import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Trash } from 'iconsax-react';
import { formatRupiah, parseRupiah } from '@/shared/utils/format';

const variantToggleSx = (checked) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 1.25,
  py: 0.85,
  borderRadius: 1.8,
  bgcolor: checked ? 'rgba(21, 93, 252, 0.07)' : '#f8fafc',
  border: '1px solid',
  borderColor: checked ? 'rgba(21, 93, 252, 0.2)' : '#e5e7eb',
  minHeight: 40,
  transition: 'all .18s ease',
});

const variantToggleTextSx = (checked) => ({
  color: checked ? '#155DFC' : '#6b7280',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.01em',
});

export default function VariantRowCard({
  row,
  index,
  canRemove = true,
  canSave = false,
  isSaving = false,
  onRemove,
  onSave,
  onChange,
}) {
  const handleChange = React.useCallback(
    (field) => (event) => onChange?.(row.key, field, event.target.value),
    [onChange, row.key]
  );
  const handleToggle = React.useCallback(
    (field) => (event) => onChange?.(row.key, field, event.target.checked),
    [onChange, row.key]
  );

  return (
    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e8edf3', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
        <Typography sx={{ color: '#111827', fontWeight: 600 }}>Variant {index + 1}</Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {canSave ? (
            <Tooltip title="Save" arrow>
              <span>
                <IconButton size="small" onClick={() => onSave?.(row.key)} disabled={isSaving} sx={{ color: '#155DFC' }}>
                  <SaveOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
          ) : null}
          {canRemove ? (
            <Tooltip title="Hapus" arrow>
              <span>
                <IconButton size="small" onClick={() => onRemove?.(row.key)} sx={{ color: '#d32f2f' }}>
                  <Trash size={18} color="#d32f2f" variant="Linear" />
                </IconButton>
              </span>
            </Tooltip>
          ) : null}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ mb: 0.5, fontSize: '0.82rem', color: '#111827', fontWeight: 600 }}>
            Name
          </Typography>
          <TextField size="small" fullWidth placeholder="Variant name" value={row.name} onChange={handleChange('name')} />
        </Box>
        <Box>
          <Typography sx={{ mb: 0.5, fontSize: '0.82rem', color: '#111827', fontWeight: 600 }}>
            SKU
          </Typography>
          <TextField size="small" fullWidth placeholder="Variant SKU" value={row.sku} onChange={handleChange('sku')} />
        </Box>
        <Box>
          <Typography sx={{ mb: 0.5, fontSize: '0.82rem', color: '#111827', fontWeight: 600 }}>
            Price
          </Typography>
          <TextField
            type="text"
            inputMode="numeric"
            size="small"
            fullWidth
            placeholder="0"
            value={formatRupiah(row.price)}
            onChange={(event) => onChange?.(row.key, 'price', parseRupiah(event.target.value))}
          />
        </Box>
        <Box sx={{ pt: 0.25 }}>
          <Typography sx={{ mb: 0.5, fontSize: '0.82rem', color: '#111827', fontWeight: 600 }}>
            Default
          </Typography>
          <Box sx={variantToggleSx(row.isDefault)}>
            <Typography sx={variantToggleTextSx(row.isDefault)}>{row.isDefault ? 'Aktif' : 'Nonaktif'}</Typography>
            <Switch
              checked={row.isDefault}
              onChange={handleToggle('isDefault')}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#155DFC', opacity: 1 },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ pt: 0.25 }}>
          <Typography sx={{ mb: 0.5, fontSize: '0.82rem', color: '#111827', fontWeight: 600 }}>
            Available
          </Typography>
          <Box sx={variantToggleSx(row.isAvailable)}>
            <Typography sx={variantToggleTextSx(row.isAvailable)}>{row.isAvailable ? 'Aktif' : 'Nonaktif'}</Typography>
            <Switch
              checked={row.isAvailable}
              onChange={handleToggle('isAvailable')}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#155DFC', opacity: 1 },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
