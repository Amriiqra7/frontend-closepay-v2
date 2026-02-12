'use client';

import { Box, Button, Collapse, Grid, InputLabel, Stack, Tooltip } from '@mui/material';
import { Filter, FilterRemove, FilterSearch } from 'iconsax-react';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';

/**
 * FilterCollapse
 * Toolbar tombol Filters beserta panel filter yang bisa di-collapse/expand.
 * Konten filter bersifat dinamis (diisi melalui children) dan dapat dibungkus
 * otomatis dalam `Grid container` agar rapi.
 *
 * Komponen ini bersifat controlled: state `open` dan aksi `onToggle` dikelola
 * oleh parent.
 *
 * @component
 * @param {boolean} open - Status panel (terbuka/tertutup).
 * @param {(nextOpen: boolean) => void} onToggle - Dipanggil saat tombol Filters ditekan.
 * @param {boolean} [hasActiveFilters=false] - Menampilkan tombol reset saat ada filter aktif.
 * @param {() => void} [onReset] - Aksi untuk mengosongkan semua filter.
 * @param {string} [buttonText="Filters"] - Teks pada tombol toggle.
 * @param {React.ReactNode} [sortNode] - Node opsional untuk aksi sort (akan sejajar dengan tombol).
 * @param {boolean} [showLabel=true] - Tampilkan label judul panel di dalam kontainer.
 * @param {string} [labelText="Filter Options"] - Teks label judul panel.
 * @param {boolean} [grid=true] - Jika true, children dibungkus `Grid container spacing={2}`.
 * @param {React.ReactNode} children - Elemen filter yang akan ditampilkan di dalam panel.
 * @param {object} [containerSx] - Styling tambahan untuk kontainer panel.
 * @param {object} [buttonSx] - Styling tambahan untuk tombol toggle.
 * @param {object} [resetButtonSx] - Styling tambahan untuk tombol reset.
 * @param {object} [collapseProps] - Properti tambahan untuk komponen MUI `Collapse`.
 * @param {boolean} [hideHeader=false] - Sembunyikan header tombol (hanya render panel).
 * @param {('text'|'icon')} [resetMode='text'] - Mode tampilan tombol reset (teks atau ikon).
 * @param {string} [resetLabel='Reset'] - Label teks untuk tombol reset saat `resetMode` = 'text'.
 *
 * @example
 * <FilterCollapse open={open} onToggle={setOpen} hasActiveFilters={hasFilters} onReset={clear}>
 *   <Grid item xs={12} sm={6} md={4}>
 *     <TextField placeholder="Cari..." />
 *   </Grid>
 * </FilterCollapse>
 */
function FilterCollapse({
  open,
  onToggle,
  hasActiveFilters,
  onReset,
  buttonText = 'Filters',
  sortNode = null,
  showLabel = true,
  labelText = 'Filter Options',
  grid = true,
  children,
  containerSx = {},
  buttonSx = {},
  resetButtonSx = {},
  collapseProps = {},
  hideHeader = false,
  resetMode = 'text', // 'text' | 'icon'
  resetLabel = 'Reset',
}) {
  const handleToggle = useCallback(() => {
    if (onToggle) onToggle(!open);
  }, [onToggle, open]);

  return (
    <Box>
      {!hideHeader && (
        <Stack direction="row" spacing={0} alignItems="center">
          <Button
            variant={open ? 'contained' : 'outlined'}
            size="small"
            onClick={handleToggle}
            startIcon={
              open ? (
                <FilterSearch size={18} color="white" />
              ) : (
                <Filter size={18} color="#080808" />
              )
            }
            sx={{
              height: '40px',
              textTransform: 'none',
              ...(open && {
                backgroundColor: '#080808',
                color: 'white',
                '&:hover': { backgroundColor: '#1a1a1a' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }),
              ...(!open && {
                borderColor: '#080808',
                color: '#080808',
                '&:hover': {
                  borderColor: '#1a1a1a',
                  bgcolor: 'rgba(8, 8, 8, 0.04)',
                },
              }),
              ...buttonSx,
            }}
          >
            {buttonText}
          </Button>

          {sortNode}

          <Collapse
            in={open}
            orientation="horizontal"
            timeout={250}
            unmountOnExit
          >
            <Box sx={{ pl: 2 }}>
              <Tooltip 
                title="Reset Filters" 
                placement="right" 
                arrow 
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'error.main',
                      '& .MuiTooltip-arrow': {
                        color: 'error.main',
                      },
                    },
                  },
                }}
              >
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={onReset}
                  startIcon={
                    resetMode === 'text' ? <FilterRemove size={18} color="white" /> : undefined
                  }
                  sx={{
                    height: '40px',
                    px: resetMode === 'text' ? 1.5 : 0,
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    backgroundColor: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                    ...resetButtonSx,
                  }}
                >
                  {resetMode === 'text' ? resetLabel : <FilterRemove size={18} color="white" />}
                </Button>
              </Tooltip>
            </Box>
          </Collapse>
        </Stack>
      )}

      <Collapse in={open} timeout={300} {...collapseProps}>
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.paper',
            ...containerSx,
          }}
        >
          {showLabel && (
            <InputLabel sx={{ fontSize: '12px', mb: 2 }}>
              {labelText}
            </InputLabel>
          )}

          {grid ? (
            <Grid container spacing={2}>
              {children}
            </Grid>
          ) : (
            children
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

FilterCollapse.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool,
  onReset: PropTypes.func,
  buttonText: PropTypes.string,
  sortNode: PropTypes.node,
  showLabel: PropTypes.bool,
  labelText: PropTypes.string,
  grid: PropTypes.bool,
  children: PropTypes.node,
  containerSx: PropTypes.object,
  buttonSx: PropTypes.object,
  resetButtonSx: PropTypes.object,
  collapseProps: PropTypes.object,
  hideHeader: PropTypes.bool,
  resetMode: PropTypes.oneOf(['text', 'icon']),
  resetLabel: PropTypes.string,
};

export default memo(FilterCollapse);

/**
 * FilterButton
 * Tombol ringan untuk membuka/menutup panel filter dan mengosongkan filter,
 * tanpa merender panelnya. Cocok dipakai di baris toolbar atas.
 *
 * @component
 * @param {boolean} open - Status panel (terbuka/tertutup).
 * @param {(nextOpen: boolean) => void} onToggle - Dipanggil saat tombol Filters ditekan.
 * @param {boolean} [hasActiveFilters=false] - Menampilkan tombol reset saat ada filter aktif.
 * @param {() => void} [onReset] - Aksi untuk mengosongkan semua filter.
 * @param {string} [buttonText="Filters"] - Teks pada tombol toggle.
 * @param {object} [buttonSx] - Styling tambahan untuk tombol toggle.
 * @param {object} [resetButtonSx] - Styling tambahan untuk tombol reset.
 * @param {React.ReactNode} [sortNode] - Node opsional untuk aksi sort.
 * @param {('text'|'icon')} [resetMode='text'] - Mode tampilan tombol reset (teks atau ikon).
 * @param {string} [resetLabel='Reset'] - Label teks untuk tombol reset saat `resetMode` = 'text'.
 */
export const FilterButton = memo(function FilterButton({
  open,
  onToggle,
  hasActiveFilters = false,
  onReset,
  buttonText = 'Filters',
  buttonSx = {},
  resetButtonSx = {},
  sortNode = null,
  resetMode = 'text', // 'text' | 'icon'
  resetLabel = 'Reset',
}) {
  const handleToggle = useCallback(() => {
    if (onToggle) onToggle(!open);
  }, [onToggle, open]);

  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Button
        variant={open ? 'contained' : 'outlined'}
        size="small"
        onClick={handleToggle}
        startIcon={
          open ? (
            <FilterSearch size={18} color="white" />
          ) : (
            <Filter size={18} color="#080808" />
          )
        }
        sx={{
          height: '40px',
          textTransform: 'none',
          ...(open && {
            backgroundColor: '#080808',
            color: 'white',
            '&:hover': { backgroundColor: '#1a1a1a' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }),
          ...(!open && {
            borderColor: '#080808',
            color: '#080808',
            '&:hover': {
              borderColor: '#1a1a1a',
              bgcolor: 'rgba(8, 8, 8, 0.04)',
            },
          }),
          ...buttonSx,
        }}
      >
        {buttonText}
      </Button>

      {sortNode}

      <Collapse in={open} orientation="horizontal" timeout={250} unmountOnExit>
        <Box sx={{ pl: 2 }}>
          <Tooltip 
            title="Reset Filters" 
            placement="right" 
            arrow 
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: 'error.main',
                  '& .MuiTooltip-arrow': {
                    color: 'error.main',
                  },
                },
              },
            }}
          >
            <Button
              color="error"
              variant="contained"
              size="small"
              onClick={onReset}
              startIcon={
                resetMode === 'text' ? <FilterRemove size={18} color="white" /> : undefined
              }
              sx={{
                height: '40px',
                px: resetMode === 'text' ? 1.5 : 0,
                whiteSpace: 'nowrap',
                textTransform: 'none',
                backgroundColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
                ...resetButtonSx,
              }}
            >
              {resetMode === 'text' ? resetLabel : <FilterRemove size={18} color="white" />}
            </Button>
          </Tooltip>
        </Box>
      </Collapse>
    </Stack>
  );
});

FilterButton.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool,
  onReset: PropTypes.func,
  buttonText: PropTypes.string,
  buttonSx: PropTypes.object,
  resetButtonSx: PropTypes.object,
  sortNode: PropTypes.node,
  resetMode: PropTypes.oneOf(['text', 'icon']),
  resetLabel: PropTypes.string,
};
