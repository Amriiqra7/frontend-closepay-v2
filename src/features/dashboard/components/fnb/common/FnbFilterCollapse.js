'use client';

import React, { useMemo, useState } from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';
import FilterCollapse from '@/shared/ui/FilterCollapse';
import { fnbTypeScale } from './styles';

const defaultStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'progress', label: 'In Progress' },
  { value: 'done', label: 'Completed' },
];

export default function FnbFilterCollapse({
  buttonText = 'Filter',
  searchLabel = 'Search',
  searchPlaceholder = 'Search keyword...',
  statusLabel = 'Status',
  statusOptions = defaultStatusOptions,
  showLabel = false,
  containerSx,
  buttonSx,
  resetButtonSx,
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    status: 'all',
  });

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== '' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.status !== 'all',
    [filters]
  );

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      status: 'all',
    });
  };

  return (
    <FilterCollapse
      open={open}
      onToggle={setOpen}
      hasActiveFilters={hasActiveFilters}
      onReset={handleReset}
      buttonText={buttonText}
      showLabel={showLabel}
      grid={false}
      containerSx={{
        mt: 1.5,
        p: 1.75,
        borderRadius: 1.5,
        ...containerSx,
      }}
      buttonSx={{
        height: 38,
        fontSize: fnbTypeScale.control,
        lineHeight: 1.3,
        ...buttonSx,
      }}
      resetButtonSx={{
        height: 38,
        fontSize: fnbTypeScale.control,
        lineHeight: 1.3,
        ...resetButtonSx,
      }}
    >
      <Grid container spacing={1.5} sx={{ mt: 0.75, mb: 0 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label={searchLabel}
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={handleChange('search')}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: fnbTypeScale.control,
              },
              '& .MuiInputLabel-root': {
                fontSize: fnbTypeScale.caption,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={handleChange('startDate')}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: fnbTypeScale.control,
              },
              '& .MuiInputLabel-root': {
                fontSize: fnbTypeScale.caption,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={handleChange('endDate')}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: fnbTypeScale.control,
              },
              '& .MuiInputLabel-root': {
                fontSize: fnbTypeScale.caption,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label={statusLabel}
            value={filters.status}
            onChange={handleChange('status')}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: fnbTypeScale.control,
              },
              '& .MuiInputLabel-root': {
                fontSize: fnbTypeScale.caption,
              },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </FilterCollapse>
  );
}
