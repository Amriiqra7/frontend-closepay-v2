'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Tooltip,
  Autocomplete,
  Grid,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Edit, Trash, Add, Eye } from 'iconsax-react';
import MainCard from '@/shared/ui/MainCard';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import { handleDeleteWithToast, handleCreateWithToast, handleUpdateWithToast } from '@/shared/utils/toast';
import MasterPerangkatDialog from './MasterPerangkatDialog';
import AlertDialog from '@/shared/ui/AlertDialog';
import TablePagination from '@/shared/ui/TablePagination';

// Mock data untuk companies
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
];

// Mock data - replace with actual API call
const mockPerangkatData = {
  1: [
    {
      id: 1,
      namaPerangkat: 'POS Terminal 1',
      kodePerangkat: 'POS001',
      deskripsi: 'Terminal POS untuk kasir utama',
    },
    {
      id: 2,
      namaPerangkat: 'POS Terminal 2',
      kodePerangkat: 'POS002',
      deskripsi: 'Terminal POS untuk kasir kedua',
    },
  ],
  2: [
    {
      id: 3,
      namaPerangkat: 'Scanner Barcode',
      kodePerangkat: 'SCN001',
      deskripsi: 'Scanner untuk membaca barcode produk',
    },
  ],
};

export default function MasterPerangkatList() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [perangkatList, setPerangkatList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'detail'
  const [selectedPerangkat, setSelectedPerangkat] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [filterNamaPerangkat, setFilterNamaPerangkat] = useState('');
  const [filterKodePerangkat, setFilterKodePerangkat] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  // Load data when company changes
  React.useEffect(() => {
    if (selectedCompany) {
      const data = mockPerangkatData[selectedCompany.id] || [];
      setPerangkatList(data);
    } else {
      setPerangkatList([]);
    }
  }, [selectedCompany]);

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setFilterNamaPerangkat('');
    setFilterKodePerangkat('');
    setColumnFilters([]);
  }, []);

  const handleFilterNamaChange = useCallback((event) => {
    const value = event.target.value;
    setFilterNamaPerangkat(value);
    
    // Update columnFilters
    const filters = [];
    if (value) {
      filters.push({ id: 'namaPerangkat', value });
    }
    if (filterKodePerangkat) {
      filters.push({ id: 'kodePerangkat', value: filterKodePerangkat });
    }
    setColumnFilters(filters);
  }, [filterKodePerangkat]);

  const handleFilterKodeChange = useCallback((event) => {
    const value = event.target.value;
    setFilterKodePerangkat(value);
    
    // Update columnFilters
    const filters = [];
    if (filterNamaPerangkat) {
      filters.push({ id: 'namaPerangkat', value: filterNamaPerangkat });
    }
    if (value) {
      filters.push({ id: 'kodePerangkat', value });
    }
    setColumnFilters(filters);
  }, [filterNamaPerangkat]);

  const handleAdd = () => {
    setSelectedPerangkat(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedPerangkat(row.original);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDetail = (row) => {
    setSelectedPerangkat(row.original);
    setDialogMode('detail');
    setDialogOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteDialog({
      open: true,
      id: row.original.id,
      name: row.original.namaPerangkat,
    });
  };

  const handleSave = useCallback(async (formData) => {
    try {
      if (selectedPerangkat) {
        // Update
        // TODO: Replace with actual API call
        // const updatePromise = PerangkatAPI.update(selectedPerangkat.id, formData);
        
        // Simulate API call
        const updatePromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('Update perangkat:', selectedPerangkat.id, formData);
            // Simulate random error for testing (remove in production)
            if (Math.random() > 0.1) {
              setPerangkatList((prevList) =>
                prevList.map((item) =>
                  item.id === selectedPerangkat.id
                    ? { ...item, ...formData }
                    : item
                )
              );
              resolve({ success: true });
            } else {
              reject(new Error('Gagal mengupdate data'));
            }
          }, 1000);
        });

        await handleUpdateWithToast(updatePromise, 'Perangkat');
      } else {
        // Create
        // TODO: Replace with actual API call
        // const createPromise = PerangkatAPI.create(formData);
        
        // Simulate API call
        const createPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('Create perangkat:', formData);
            // Simulate random error for testing (remove in production)
            if (Math.random() > 0.1) {
              setPerangkatList((prevList) => {
                const newId = Math.max(...prevList.map((p) => p.id), 0) + 1;
                const newPerangkat = {
                  id: newId,
                  ...formData,
                };
                return [...prevList, newPerangkat];
              });
              resolve({ success: true });
            } else {
              reject(new Error('Gagal menambahkan data'));
            }
          }, 1000);
        });

        await handleCreateWithToast(createPromise, 'Perangkat');
      }
    } catch (err) {
      // Error already handled by toast
      throw err;
    }
  }, [selectedPerangkat]);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const deletePromise = PerangkatAPI.delete(deleteDialog.id);
      
      // Simulate API call
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Delete perangkat:', deleteDialog.id);
          // Simulate random error for testing (remove in production)
          if (Math.random() > 0.1) {
            setPerangkatList((prevList) => prevList.filter((item) => item.id !== deleteDialog.id));
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Perangkat',
        deleteDialog.name
      );
      
      setDeleteDialog({ open: false, id: null, name: '' });
      // Optionally reload the page or refetch data
      // window.location.reload();
    } catch (err) {
      // Error already handled by toast
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  }, [deleteDialog]);

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || filterNamaPerangkat || filterKodePerangkat,
    [columnFilters, filterNamaPerangkat, filterKodePerangkat]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...perangkatList];

    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || '';
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [perangkatList, columnFilters]);

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
        accessorKey: 'namaPerangkat',
        header: 'Nama Perangkat',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'kodePerangkat',
        header: 'Kode Perangkat',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue() || '-'}</Typography>
        ),
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
        muiTableHeadCellProps: { align: 'left' },
      },
    },
    renderRowActions: ({ row }) => (
      <Box display="flex" gap={0.5} justifyContent="flex-start" alignItems="center">
        <Tooltip title="Detail" arrow>
          <IconButton
            size="small"
            onClick={() => handleDetail(row)}
            sx={{
              color: '#1976d2',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <Eye size={20} variant="Linear" color="#1976d2" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => handleEdit(row)}
            sx={{
              color: '#ed6c02',
              '&:hover': {
                bgcolor: 'rgba(237, 108, 2, 0.08)',
              },
            }}
          >
            <Edit size={20} variant="Linear" color="#ed6c02" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus" arrow>
          <IconButton
            size="small"
            onClick={() => handleDelete(row)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            <Trash size={20} variant="Linear" color="#d32f2f" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
      <Box sx={{ width: '100%', height: '100%' }}>
        {/* Company Selector */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
            Pilih Perusahaan<span style={{ color: 'red' }}> *</span>
          </Typography>
          <Autocomplete
            fullWidth
            size="small"
            options={mockCompanies}
            getOptionLabel={(option) => option?.nama || ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={selectedCompany}
            onChange={(_, newValue) => {
              setSelectedCompany(newValue);
              setFilterNamaPerangkat('');
              setFilterKodePerangkat('');
              setColumnFilters([]);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pilih perusahaan"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Action Buttons and Filters - Only show when company is selected */}
        {selectedCompany && (
          <>
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
                borderTopLeftRadius: selectedCompany ? 0 : 8,
                borderTopRightRadius: selectedCompany ? 0 : 8,
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
                  startIcon={<Add size={20} color="white" />}
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
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Cari nama perangkat..."
                    value={filterNamaPerangkat}
                    onChange={handleFilterNamaChange}
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Cari kode perangkat..."
                    value={filterKodePerangkat}
                    onChange={handleFilterKodeChange}
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
              </Grid>
            </FilterCollapse>

            {/* MaterialReactTable */}
            <Box sx={{ pb: 4 }}>
              <MaterialReactTable table={table} />
            </Box>
          </>
        )}
      </Box>

      {/* Dialog */}
      <MasterPerangkatDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedPerangkat(null);
        }}
        onSave={handleSave}
        data={selectedPerangkat}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
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
    </>
  );
}
