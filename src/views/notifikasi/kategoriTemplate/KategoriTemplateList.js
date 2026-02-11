'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Chip,
  Tooltip,
  Select,
  MenuItem,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Edit, Trash, Lock1 } from 'iconsax-react';
import { usePathname } from 'next/navigation';
import TablePagination from '@/components/TablePagination';
import AlertDialog from '@/components/AlertDialog';
import FilterCollapse, { FilterButton } from '@/components/FilterCollapse';
import KategoriTemplateForm from './KategoriTemplateForm';

// Sample data - replace with actual API call
const generateMockKategoriTemplate = () => {
  return [
    {
      id: 1,
      nama: 'ACTIVATION ADMIN',
      status: 'aktif',
    },
    {
      id: 2,
      nama: 'ACTIVATION MEMBER',
      status: 'aktif',
    },
    {
      id: 3,
      nama: 'ACTIVATION MERCHANT',
      status: 'aktif',
    },
    {
      id: 4,
      nama: 'ADD BANK ACCOUNT',
      status: 'aktif',
    },
    {
      id: 5,
      nama: 'BALANCE BULK UPLOAD TOP UP MERCHANT',
      status: 'aktif',
    },
    {
      id: 6,
      nama: 'BALANCE TRANSACTION BARCODE',
      status: 'aktif',
    },
    {
      id: 7,
      nama: 'TEMPLATE NOTIFIKASI 1',
      status: 'nonaktif',
    },
    {
      id: 8,
      nama: 'TEMPLATE NOTIFIKASI 2',
      status: 'nonaktif',
    },
  ];
};

const mockKategoriTemplate = generateMockKategoriTemplate();

export default function KategoriTemplateList() {
  const pathname = usePathname();
  
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: 'add', // 'add' or 'edit'
    id: null,
    nama: '',
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: '',
  });

  const [deactivateDialog, setDeactivateDialog] = useState({
    open: false,
    id: null,
    name: '',
  });

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchValue(value);
    
    // Update columnFilters
    const filters = [];
    if (value) {
      filters.push({ id: 'nama', value });
    }
    if (statusFilter) {
      filters.push({ id: 'status', value: statusFilter });
    }
    setColumnFilters(filters);
  }, [statusFilter]);

  const handleStatusFilterChange = useCallback((event) => {
    const value = event.target.value;
    setStatusFilter(value);
    
    // Update columnFilters
    const filters = [];
    if (searchValue) {
      filters.push({ id: 'nama', value: searchValue });
    }
    if (value) {
      filters.push({ id: 'status', value });
    }
    setColumnFilters(filters);
  }, [searchValue]);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setStatusFilter('');
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || searchValue || statusFilter,
    [columnFilters, searchValue, statusFilter]
  );

  // Filter data based on columnFilters
  const filteredData = useMemo(() => {
    let filtered = [...mockKategoriTemplate];

    // Apply column filters
    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || '';
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [columnFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    const sorted = [...filteredData];
    const sort = sorting[0];
    sorted.sort((a, b) => {
      const aVal = a[sort.id] || '';
      const bVal = b[sort.id] || '';
      if (sort.desc) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    return sorted;
  }, [filteredData, sorting]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [sortedData, pagination]);

  const handleAdd = useCallback(() => {
    setFormDialog({
      open: true,
      mode: 'add',
      id: null,
      nama: '',
    });
  }, []);

  const handleEdit = useCallback((item) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      id: item.id,
      nama: item.nama,
    });
  }, []);

  const handleDelete = useCallback((item) => {
    setDeleteDialog({
      open: true,
      id: item.id,
      name: item.nama,
    });
  }, []);

  const handleDeactivate = useCallback((item) => {
    setDeactivateDialog({
      open: true,
      id: item.id,
      name: item.nama,
    });
  }, []);

  const handleFormSubmit = useCallback(() => {
    // TODO: Implement API call to save/update
    console.log('Form submit:', formDialog);
    setFormDialog({ open: false, mode: 'add', id: null, nama: '' });
  }, [formDialog]);

  const handleConfirmDelete = useCallback(() => {
    // TODO: Implement API call to delete
    console.log('Delete kategori template:', deleteDialog.id);
    setDeleteDialog({ open: false, id: null, name: '' });
  }, [deleteDialog]);

  const handleConfirmDeactivate = useCallback(() => {
    // TODO: Implement API call to deactivate
    console.log('Deactivate kategori template:', deactivateDialog.id);
    setDeactivateDialog({ open: false, id: null, name: '' });
  }, [deactivateDialog]);

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'NO',
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        enableSorting: false,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const isAktif = status === 'aktif';
          return (
            <Chip
              label={isAktif ? 'Aktif' : 'Nonaktif'}
              size="small"
              sx={{
                bgcolor: isAktif ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                color: isAktif ? '#4caf50' : '#f44336',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: paginatedData,
    getRowId: (row) => row.id.toString(),
    rowCount: sortedData.length,
    state: {
      columnFilters,
      isLoading: false,
      pagination,
      sorting,
    },
    initialState: {
      density: 'compact',
    },
    enableRowNumbers: false,
    enableRowActions: true,
    enableSorting: true,
    enableEditing: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: true,
    enableTopToolbar: false,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: false,
    positionActionsColumn: 'last',
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: '12px !important',
        backgroundColor: 'rgba(248, 249, 250, 1)',
        borderTop: '1px solid rgba(232, 235, 238, 1) !important',
        borderBottom: '2px solid rgba(232, 235, 238, 1) !important',
        '& .MuiTableSortLabel-icon, & .MuiIconButton-root, & .MuiBadge-root': {
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        '&:hover .MuiTableSortLabel-icon, &:hover .MuiIconButton-root, &:hover .MuiBadge-root': {
          opacity: 1,
        },
        '& .MuiTableSortLabel-active .MuiTableSortLabel-icon': {
          opacity: 1,
        },
      }),
    },
    muiTableBodyCellProps: {
      sx: { fontSize: '12px !important' },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(even)': {
          backgroundColor: 'rgba(248, 249, 250, 1) !important',
        },
      }),
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        mb: 4,
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: 'rgba(255, 255, 255, 1)',
    }),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
      },
    },
    renderRowActions: ({ row }) => {
      const isAktif = row.original.status === 'aktif';
      return (
        <Box display="flex">
          <Tooltip title={isAktif ? 'Nonaktifkan' : 'Aktifkan'} arrow>
            <IconButton
              size="small"
              color={isAktif ? 'error' : 'success'}
              onClick={() => handleDeactivate(row.original)}
            >
              <Lock1 size={20} variant="Linear" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" arrow>
            <IconButton
              size="small"
              color="success"
              onClick={() => handleEdit(row.original)}
            >
              <Edit size={20} variant="Linear" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus" arrow>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.original)}
            >
              <Trash size={20} variant="Linear" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={sortedData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    ),
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        {/* Toolbar dengan tombol Filter dan Tambah */}
        <Box
          sx={{
            p: 2,
            pt: 2,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: 1.5,
            rowGap: 1.5,
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexShrink: 0,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <FilterButton
              open={showFilters}
              onToggle={handleToggleFilters}
              hasActiveFilters={hasActiveFilters}
              onReset={handleResetFilter}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            <Button
              variant="contained"
              startIcon={<Add size={20} color='white' />}
              onClick={handleAdd}
              sx={{
                textTransform: 'none',
              }}
            >
              Tambah
            </Button>
          </Box>
        </Box>

        {/* FilterCollapse untuk input filter */}
        <FilterCollapse
          open={showFilters}
          onToggle={handleToggleFilters}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilter}
          buttonText="Filters"
          showLabel={false}
          hideHeader
          containerSx={{
            p: 2,
            border: 'none',
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
            mt: 0,
            flexShrink: 0,
          }}
        >
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              placeholder="Cari nama template..."
              value={searchValue}
              onChange={handleSearchChange}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              displayEmpty
              fullWidth
              size="small"
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary' }}>Status</Typography>;
                }
                return selected === 'aktif' ? 'Aktif' : 'Nonaktif';
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    overflowY: 'auto',
                  },
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="aktif">Aktif</MenuItem>
              <MenuItem value="nonaktif">Nonaktif</MenuItem>
            </Select>
          </Grid>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 4 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Form Dialog (Add/Edit) */}
      <KategoriTemplateForm
        open={formDialog.open}
        mode={formDialog.mode}
        nama={formDialog.nama}
        onClose={() => setFormDialog({ open: false, mode: 'add', id: null, nama: '' })}
        onSubmit={handleFormSubmit}
        onNamaChange={(value) => setFormDialog((prev) => ({ ...prev, nama: value }))}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus <strong>{deleteDialog.name}</strong>?
          </Typography>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog
        open={deactivateDialog.open}
        onClose={() => setDeactivateDialog({ open: false, id: null, name: '' })}
        onConfirm={handleConfirmDeactivate}
        title="Konfirmasi Nonaktifkan"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menonaktifkan <strong>{deactivateDialog.name}</strong>?
          </Typography>
        }
        confirmText="Nonaktifkan"
        cancelText="Batal"
        confirmColor="error"
      />
    </>
  );
}
