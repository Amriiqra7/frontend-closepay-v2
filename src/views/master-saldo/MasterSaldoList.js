'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Edit, Trash, Add } from 'iconsax-react';
import MainCard from '@/shared/ui/MainCard';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import { handleDeleteWithToast, handleCreateWithToast, handleUpdateWithToast } from '@/shared/utils/toast';
import MasterSaldoDialog from './MasterSaldoDialog';
import AlertDialog from '@/shared/ui/AlertDialog';
import TablePagination from '@/shared/ui/TablePagination';

// Mock data - replace with actual API call
const mockMasterSaldoData = [
  {
    id: 1,
    namaMasterSaldo: 'Saldo Utama',
    kodeSaldo: 'CLOSEPAY',
    saldoMaksimal: '1000000000',
    limitSekaliTransaksi: '50000000',
    limitTransaksiHarian: '200000000',
    limitTransaksiBulanan: '5000000000',
    jenisTransaksi: ['Transfer', 'Top Up', 'Withdraw'],
  },
  {
    id: 2,
    namaMasterSaldo: 'Saldo Tabungan',
    kodeSaldo: 'TABUNGAN',
    saldoMaksimal: '500000000',
    limitSekaliTransaksi: '10000000',
    limitTransaksiHarian: '50000000',
    limitTransaksiBulanan: '1000000000',
    jenisTransaksi: ['Transfer', 'Top Up'],
  },
];

// Mock jenis transaksi options
const jenisTransaksiOptions = [
  'Transfer',
  'Top Up',
  'Withdraw',
  'Payment',
  'Refund',
  'Deposit',
];

export default function MasterSaldoList() {
  const [masterSaldoList, setMasterSaldoList] = useState(mockMasterSaldoData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSaldo, setSelectedSaldo] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [filterNamaSaldo, setFilterNamaSaldo] = useState('');
  const [filterKodeSaldo, setFilterKodeSaldo] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setFilterNamaSaldo('');
    setFilterKodeSaldo('');
    setColumnFilters([]);
  }, []);

  const handleFilterChange = useCallback((field, value) => {
    if (field === 'namaSaldo') {
      setFilterNamaSaldo(value);
    } else if (field === 'kodeSaldo') {
      setFilterKodeSaldo(value);
    }

    // Update columnFilters
    const filters = [];
    if (field === 'namaSaldo' && value) {
      filters.push({ id: 'namaMasterSaldo', value });
    } else if (field === 'kodeSaldo' && value) {
      filters.push({ id: 'kodeSaldo', value });
    }
    // Keep other filters
    columnFilters.forEach((f) => {
      if (f.id !== 'namaMasterSaldo' && f.id !== 'kodeSaldo') {
        filters.push(f);
      }
    });
    setColumnFilters(filters);
  }, [columnFilters]);

  const hasActiveFilters = useMemo(
    () => filterNamaSaldo || filterKodeSaldo || columnFilters.length > 0,
    [filterNamaSaldo, filterKodeSaldo, columnFilters]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...masterSaldoList];

    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || '';
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [masterSaldoList, columnFilters]);

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

  const handleTambah = () => {
    setSelectedSaldo(null);
    setDialogOpen(true);
  };

  const handleEdit = (saldo) => {
    setSelectedSaldo(saldo);
    setDialogOpen(true);
  };

  const handleDelete = (saldo) => {
    setDeleteDialog({
      open: true,
      id: saldo.id,
      name: saldo.namaMasterSaldo,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Deleting master saldo:', deleteDialog.id);
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Master Saldo',
        deleteDialog.name
      );

      setMasterSaldoList((prev) =>
        prev.filter((item) => item.id !== deleteDialog.id)
      );
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSaldo(null);
  };

  const handleSave = async (data) => {
    try {
      const savePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Saving master saldo:', data);
          if (Math.random() > 0.1) {
            resolve({ success: true, data });
          } else {
            reject(new Error('Gagal menyimpan data'));
          }
        }, 1000);
      });

      if (selectedSaldo) {
        // Update existing
        await handleUpdateWithToast(savePromise, 'master saldo');
        setMasterSaldoList((prev) =>
          prev.map((item) =>
            item.id === selectedSaldo.id ? { ...data, id: selectedSaldo.id } : item
          )
        );
      } else {
        // Add new
        await handleCreateWithToast(savePromise, 'master saldo');
        const newId = Math.max(...masterSaldoList.map((item) => item.id), 0) + 1;
        setMasterSaldoList((prev) => [...prev, { ...data, id: newId }]);
      }

      handleCloseDialog();
    } catch (err) {
      // Error already handled by toast
    }
  };

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
        accessorKey: 'namaMasterSaldo',
        header: 'Nama Master Saldo',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'kodeSaldo',
        header: 'Kode Saldo',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
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
      <Box
        display="flex"
        gap={0.5}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => handleEdit(row.original)}
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
            onClick={() => handleDelete(row.original)}
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
              onClick={handleTambah}
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Cari nama saldo..."
              value={filterNamaSaldo}
              onChange={(e) => handleFilterChange('namaSaldo', e.target.value)}
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
              placeholder="Cari kode saldo..."
              value={filterKodeSaldo}
              onChange={(e) => handleFilterChange('kodeSaldo', e.target.value)}
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

      {/* Dialog Form */}
      <MasterSaldoDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        data={selectedSaldo}
        jenisTransaksiOptions={jenisTransaksiOptions}
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
    </>
  );
}
