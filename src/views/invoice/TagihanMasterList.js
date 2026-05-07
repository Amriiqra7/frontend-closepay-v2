'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Edit, Trash, Add, DocumentDownload } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import { handleDeleteWithToast } from '@/shared/utils/toast';
import AlertDialog from '@/shared/ui/AlertDialog';
import TablePagination from '@/shared/ui/TablePagination';
import { formatRupiah } from '@/shared/utils/format';

// Mock data - replace with actual API call
const mockTagihanMasterData = [
  {
    id: 1,
    tanggalPembuatan: '2026-02-22 20:13:40',
    namaMasterInvoice: 'testing',
    jenisUserInvoice: 'MEMBER',
    tipeInvoice: 'Umum',
    nominalInvoice: 9000,
    totalAkunTertagih: 1,
    totalAkunLunas: 0,
    totalTagihanTerbayar: 0,
    totalTagihanBelumTerbayar: 9000,
    totalSeluruhTagihan: 9000,
  },
];

// Options untuk dropdown
const jenisUserInvoiceOptions = ['MEMBER', 'ADMIN', 'MERCHANT'];
const tipeInvoiceOptions = ['Umum', 'Khusus', 'Bulanan'];

export default function TagihanMasterList() {
  const router = useRouter();
  const [tagihanMasterList, setTagihanMasterList] = useState(mockTagihanMasterData);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState({ start: null, end: null });
  const [filterNamaMaster, setFilterNamaMaster] = useState('');
  const [filterJenisUserInvoice, setFilterJenisUserInvoice] = useState('');
  const [filterTipeInvoice, setFilterTipeInvoice] = useState('');
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
    setFilterDateRange({ start: null, end: null });
    setFilterNamaMaster('');
    setFilterJenisUserInvoice('');
    setFilterTipeInvoice('');
    setColumnFilters([]);
  }, []);

  const handleFilterChange = useCallback((field, value) => {
    if (field === 'namaMaster') {
      setFilterNamaMaster(value);
    } else if (field === 'jenisUserInvoice') {
      setFilterJenisUserInvoice(value);
    } else if (field === 'tipeInvoice') {
      setFilterTipeInvoice(value);
    }

    // Update columnFilters
    const filters = [];
    if (field === 'namaMaster' && value) {
      filters.push({ id: 'namaMasterInvoice', value });
    } else if (field === 'jenisUserInvoice' && value) {
      filters.push({ id: 'jenisUserInvoice', value });
    } else if (field === 'tipeInvoice' && value) {
      filters.push({ id: 'tipeInvoice', value });
    }
    // Keep other filters
    columnFilters.forEach((f) => {
      if (f.id !== 'namaMasterInvoice' && f.id !== 'jenisUserInvoice' && f.id !== 'tipeInvoice') {
        filters.push(f);
      }
    });
    setColumnFilters(filters);
  }, [columnFilters]);

  const hasActiveFilters = useMemo(
    () => filterDateRange.start || filterDateRange.end || filterNamaMaster || filterJenisUserInvoice || filterTipeInvoice || columnFilters.length > 0,
    [filterDateRange, filterNamaMaster, filterJenisUserInvoice, filterTipeInvoice, columnFilters]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...tagihanMasterList];

    // Filter by date range
    if (filterDateRange.start || filterDateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.tanggalPembuatan);
        if (filterDateRange.start && filterDateRange.end) {
          return itemDate.isAfter(dayjs(filterDateRange.start).subtract(1, 'day')) && 
                 itemDate.isBefore(dayjs(filterDateRange.end).add(1, 'day'));
        } else if (filterDateRange.start) {
          return itemDate.isAfter(dayjs(filterDateRange.start).subtract(1, 'day'));
        } else if (filterDateRange.end) {
          return itemDate.isBefore(dayjs(filterDateRange.end).add(1, 'day'));
        }
        return true;
      });
    }

    // Filter by column filters
    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || '';
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [tagihanMasterList, filterDateRange, columnFilters]);

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
    router.push('/admin/invoice/tagihan-master/new');
  };

  const handleEdit = (tagihan) => {
    // TODO: Implement edit master invoice
    console.log('Edit Master Invoice:', tagihan);
  };

  const handleDelete = (tagihan) => {
    setDeleteDialog({
      open: true,
      id: tagihan.id,
      name: tagihan.namaMasterInvoice,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Deleting master invoice:', deleteDialog.id);
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Master Invoice',
        deleteDialog.name
      );

      setTagihanMasterList((prev) =>
        prev.filter((item) => item.id !== deleteDialog.id)
      );
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleUnduhData = () => {
    // TODO: Implement unduh data master invoice
    console.log('Unduh Data Master Invoice');
  };

  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
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
        header: 'No',
        size: 60,
        minSize: 60,
        maxSize: 60,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: { 
          align: 'center'
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center" sx={{ fontSize: '12px' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'tanggalPembuatan',
        header: 'Tanggal Pembuatan',
        size: 200,
        minSize: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: '12px' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'namaMasterInvoice',
        header: 'Nama Master Invoice',
        size: 220,
        minSize: 220,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: '12px' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'jenisUserInvoice',
        header: 'Jenis User Invoice',
        size: 180,
        minSize: 180,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: '12px' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tipeInvoice',
        header: 'Tipe Invoice',
        size: 140,
        minSize: 140,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: '12px' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'nominalInvoice',
        header: 'Nominal Invoice',
        size: 170,
        minSize: 170,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
        ),
      },
      {
        accessorKey: 'totalAkunTertagih',
        header: 'Total Akun Tertagih',
        size: 180,
        minSize: 180,
        muiTableHeadCellProps: { 
          align: 'center'
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center" sx={{ fontSize: '12px' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'totalAkunLunas',
        header: 'Total Akun Lunas',
        size: 170,
        minSize: 170,
        muiTableHeadCellProps: { 
          align: 'center'
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center" sx={{ fontSize: '12px' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'totalTagihanTerbayar',
        header: 'Total Tagihan Terbayar',
        size: 200,
        minSize: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
        ),
      },
      {
        accessorKey: 'totalTagihanBelumTerbayar',
        header: 'Total Tagihan Belum Terbayar',
        size: 250,
        minSize: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
        ),
      },
      {
        accessorKey: 'totalSeluruhTagihan',
        header: 'Total Seluruh Tagihan',
        size: 200,
        minSize: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
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
        fontWeight: 'normal',
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
    muiTableContainerProps: {
      sx: {
        maxWidth: '100%',
      },
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
      <MainCard content={false}>
        <Box sx={{ width: '100%', height: '100%' }}>
          {/* Header dengan tombol Tambah dan Unduh */}
          <Box
            sx={{
              p: 2,
              pt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              backgroundColor: 'white',
              borderBottom: '1px solid rgba(232, 235, 238, 1)',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <FilterButton
              open={showFilters}
              onToggle={handleToggleFilters}
              hasActiveFilters={hasActiveFilters}
              onReset={handleResetFilter}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Add size={20} color="white" />}
                onClick={handleTambah}
                sx={{
                  textTransform: 'none',
                }}
              >
                Tambah Master Invoice
              </Button>
              <Button
                variant="contained"
                startIcon={<DocumentDownload size={20} color="white" />}
                onClick={handleUnduhData}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                }}
              >
                Unduh Data Master Invoice
              </Button>
            </Box>
          </Box>

          {/* FilterCollapse untuk input filter */}
          <FilterCollapse
            open={showFilters}
            onToggle={handleToggleFilters}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilter}
            buttonText="Filter"
            showLabel={false}
            hideHeader
            grid={false}
            containerSx={{
              p: 2,
              border: 'none',
              backgroundColor: 'white',
              borderBottom: '1px solid rgba(232, 235, 238, 1)',
              mt: 0,
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Mulai"
                  value={filterDateRange.start ? dayjs(filterDateRange.start) : null}
                  onChange={(newValue) => {
                    setFilterDateRange((prev) => ({ ...prev, start: newValue ? newValue.toDate() : null }));
                  }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Akhir"
                  value={filterDateRange.end ? dayjs(filterDateRange.end) : null}
                  onChange={(newValue) => {
                    setFilterDateRange((prev) => ({ ...prev, end: newValue ? newValue.toDate() : null }));
                  }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                placeholder="Cari Nama Master"
                value={filterNamaMaster}
                onChange={(e) => handleFilterChange('namaMaster', e.target.value)}
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
              <FormControl fullWidth size="small">
                <InputLabel>Cari Jenis User Invoice</InputLabel>
                <Select
                  value={filterJenisUserInvoice}
                  onChange={(e) => handleFilterChange('jenisUserInvoice', e.target.value)}
                  label="Cari Jenis User Invoice"
                >
                  <MenuItem value="">Semua</MenuItem>
                  {jenisUserInvoiceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Cari Tipe Invoice</InputLabel>
                <Select
                  value={filterTipeInvoice}
                  onChange={(e) => handleFilterChange('tipeInvoice', e.target.value)}
                  label="Cari Tipe Invoice"
                >
                  <MenuItem value="">Semua</MenuItem>
                  {tipeInvoiceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </FilterCollapse>

          {/* MaterialReactTable */}
          <Box sx={{ pb: 4 }}>
            <MaterialReactTable table={table} />
          </Box>
        </Box>
      </MainCard>

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
