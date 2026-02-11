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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Paper,
  Switch,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Edit, Trash, Profile2User } from 'iconsax-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import TablePagination from '@/components/TablePagination';
import AlertDialog from '@/components/AlertDialog';
import FilterCollapse, { FilterButton } from '@/components/FilterCollapse';

const MotionPaper = motion(Paper);

// Sample data - replace with actual API call
const generateMockTemplate = () => {
  return [
    {
      id: 1,
      namaTemplate: 'Adjustment Admin Bulk',
      templateKey: 'BULK UPLOAD ADJUSTMENT ADMIN',
      tipeTemplate: 'Email',
      jenisUser: '',
      status: 'aktif',
    },
    {
      id: 2,
      namaTemplate: 'Aktivasi Akun Admin',
      templateKey: 'ACTIVATION ADMIN',
      tipeTemplate: 'Email',
      jenisUser: '',
      status: 'aktif',
    },
    {
      id: 3,
      namaTemplate: 'Aktivasi Akun Member',
      templateKey: 'ACTIVATION MEMBER',
      tipeTemplate: 'Email',
      jenisUser: '',
      status: 'aktif',
    },
    {
      id: 4,
      namaTemplate: 'Aktivasi Akun Merchant',
      templateKey: 'ACTIVATION MERCHANT',
      tipeTemplate: 'Email',
      jenisUser: 'MERCHANT',
      status: 'aktif',
    },
    {
      id: 5,
      namaTemplate: 'Blokir Fitur LMS telah dibuka',
      templateKey: 'LMS UNBLOCKED',
      tipeTemplate: 'Email',
      jenisUser: 'MEMBER',
      status: 'aktif',
    },
    {
      id: 6,
      namaTemplate: 'Card Payment Gateway',
      templateKey: 'CARD CARD PAYMENT GATEWAY',
      tipeTemplate: 'Email',
      jenisUser: '',
      status: 'aktif',
    },
  ];
};

const mockTemplate = generateMockTemplate();

export default function TemplateList() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dialog states
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

  const [ubahJenisUserDialog, setUbahJenisUserDialog] = useState({
    open: false,
    id: null,
    namaTemplate: '',
    jenisUser: '',
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
    if (value) {
      setColumnFilters([{ id: 'namaTemplate', value }]);
    } else {
      setColumnFilters([]);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || searchValue,
    [columnFilters, searchValue]
  );

  // Filter data based on columnFilters
  const filteredData = useMemo(() => {
    let filtered = [...mockTemplate];

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

  const handleEdit = useCallback((item) => {
    router.push(`${pathname}/new?id=${item.id}`);
  }, [router, pathname]);

  const handleDelete = useCallback((item) => {
    setDeleteDialog({
      open: true,
      id: item.id,
      name: item.namaTemplate,
    });
  }, []);

  const handleDeactivate = useCallback((item) => {
    setDeactivateDialog({
      open: true,
      id: item.id,
      name: item.namaTemplate,
    });
  }, []);

  const handleUbahJenisUser = useCallback((item) => {
    setUbahJenisUserDialog({
      open: true,
      id: item.id,
      namaTemplate: item.namaTemplate,
      jenisUser: item.jenisUser || '',
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    // TODO: Implement API call to delete
    console.log('Delete template:', deleteDialog.id);
    setDeleteDialog({ open: false, id: null, name: '' });
  }, [deleteDialog]);

  const handleConfirmDeactivate = useCallback(() => {
    // TODO: Implement API call to deactivate
    console.log('Deactivate template:', deactivateDialog.id);
    setDeactivateDialog({ open: false, id: null, name: '' });
  }, [deactivateDialog]);

  const handleConfirmUbahJenisUser = useCallback(() => {
    // TODO: Implement API call to update jenis user
    console.log('Ubah jenis user:', ubahJenisUserDialog.id, ubahJenisUserDialog.jenisUser);
    setUbahJenisUserDialog({ open: false, id: null, namaTemplate: '', jenisUser: '' });
  }, [ubahJenisUserDialog]);

  const handleAdd = useCallback(() => {
    router.push(`${pathname}/new`);
  }, [router, pathname]);

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
        accessorKey: 'namaTemplate',
        header: 'Nama Template',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'templateKey',
        header: 'Template Key',
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tipeTemplate',
        header: 'Tipe Template',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'jenisUser',
        header: 'Jenis User',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <Typography variant="body2">{value || '-'}</Typography>
          );
        },
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
        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title={isAktif ? 'Nonaktifkan Template' : 'Aktifkan Template'} arrow>
            <Switch
              checked={isAktif}
              onChange={() => handleDeactivate(row.original)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4caf50',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#4caf50',
                },
              }}
            />
          </Tooltip>
          <Tooltip title="Ubah Jenis User" arrow>
            <IconButton
              size="small"
              onClick={() => handleUbahJenisUser(row.original)}
              sx={{
                color: '#9c27b0',
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 0.1)',
                },
              }}
            >
              <Profile2User size={20} variant="Linear" color="#9c27b0" />
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
              Tambah Template
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
          <Grid item xs={12} sm={6} md={3}>
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
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 4 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

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
            Apakah anda yakin akan menonaktifkan template <strong>{deactivateDialog.name}</strong>?
          </Typography>
        }
        confirmText="Nonaktifkan"
        cancelText="Batal"
        confirmColor="error"
      />

      {/* Ubah Jenis User Dialog */}
      <AnimatePresence>
        {ubahJenisUserDialog.open && (
          <Dialog
            open={ubahJenisUserDialog.open}
            onClose={() => setUbahJenisUserDialog({ open: false, id: null, namaTemplate: '', jenisUser: '' })}
            maxWidth="sm"
            fullWidth
            PaperComponent={MotionPaper}
            PaperProps={{
              initial: { opacity: 0, scale: 0.9, y: 20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9, y: 20 },
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              },
              sx: (theme) => ({
                borderRadius: 2,
                boxShadow: theme.shadows[24],
              }),
            }}
            TransitionProps={{
              timeout: 200,
            }}
          >
            <DialogTitle
              sx={(theme) => ({
                fontWeight: 600,
                padding: theme.spacing(2.5, 3, 1.25, 3),
              })}
            >
              Ubah Jenis User - {ubahJenisUserDialog.namaTemplate}
            </DialogTitle>
            <DialogContent
              sx={(theme) => ({
                padding: theme.spacing(1.25, 3),
              })}
            >
              <Select
                fullWidth
                value={ubahJenisUserDialog.jenisUser}
                onChange={(e) => setUbahJenisUserDialog((prev) => ({ ...prev, jenisUser: e.target.value }))}
                displayEmpty
                size="small"
                sx={{
                  mt: 1,
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
                <MenuItem value="">Pilih</MenuItem>
                <MenuItem value="Superadmin">Superadmin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Merchant">Merchant</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions
              sx={(theme) => ({
                padding: theme.spacing(1.25, 3, 2.5, 3),
                gap: theme.spacing(1),
              })}
            >
              <Button
                variant="outlined"
                onClick={() => setUbahJenisUserDialog({ open: false, id: null, namaTemplate: '', jenisUser: '' })}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmUbahJenisUser}
              >
                Simpan
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
