'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
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
import { DocumentDownload, Add, Eye, MoneyRecive } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';
import MainCard from '@/shared/ui/MainCard';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse from '@/shared/ui/FilterCollapse';
import PanduanTagihanPenggunaanLayananDialog from './PanduanTagihanPenggunaanLayananDialog';
import UnduhDataTagihanDialog from './UnduhDataTagihanDialog';
import TambahDataTagihanDialog from './TambahDataTagihanDialog';
import RiwayatPembayaranTagihanDialog from './RiwayatPembayaranTagihanDialog';
import DetailTagihanDialog from './DetailTagihanDialog';

// Mock data tagihan penggunaan layanan
const mockTagihanPenggunaanLayananData = {
  1: [
    {
      id: 1,
      tanggal: '2026-02-02 13:33:58',
      namaTagihan: 'Demo Quality Assurance',
      status: 'DICICIL',
      totalTagihan: 5000000,
      sisaTagihan: 4890000,
    },
    {
      id: 2,
      tanggal: '2026-01-15 10:20:30',
      namaTagihan: 'Tagihan Layanan Premium',
      status: 'LUNAS',
      totalTagihan: 2000000,
      sisaTagihan: 0,
    },
  ],
};

export default function TagihanPenggunaanLayananTab({ companyId }) {
  const [panduanDialogOpen, setPanduanDialogOpen] = useState(false);
  const [unduhDialogOpen, setUnduhDialogOpen] = useState(false);
  const [tambahTagihanDialogOpen, setTambahTagihanDialogOpen] = useState(false);
  const [riwayatPembayaranDialogOpen, setRiwayatPembayaranDialogOpen] = useState(false);
  const [detailTagihanDialogOpen, setDetailTagihanDialogOpen] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState({ start: null, end: null });
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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
    setFilterStatus('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(filterDateRange.start || filterDateRange.end || filterStatus);
  }, [filterDateRange, filterStatus]);

  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
  };

  const handleRiwayatPembayaran = (row) => {
    setSelectedTagihan(row.original);
    setRiwayatPembayaranDialogOpen(true);
  };

  const handleDetail = (row) => {
    setSelectedTagihan(row.original);
    setDetailTagihanDialogOpen(true);
  };

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  // Filter data berdasarkan date range dan status
  const filteredData = useMemo(() => {
    let data = mockTagihanPenggunaanLayananData[companyId] || [];
    if (filterDateRange.start || filterDateRange.end) {
      data = data.filter((item) => {
        const itemDate = dayjs(item.tanggal);
        if (filterDateRange.start && itemDate.isBefore(filterDateRange.start, 'day')) {
          return false;
        }
        if (filterDateRange.end && itemDate.isAfter(filterDateRange.end, 'day')) {
          return false;
        }
        return true;
      });
    }
    if (filterStatus) {
      data = data.filter((item) => item.status === filterStatus);
    }
    return data;
  }, [companyId, filterDateRange, filterStatus]);

  // Sorted and paginated data
  const sortedData = useMemo(() => {
    let data = [...filteredData];
    if (sorting.length > 0) {
      const sort = sorting[0];
      data.sort((a, b) => {
        const aValue = a[sort.id];
        const bValue = b[sort.id];
        if (aValue < bValue) return sort.desc ? 1 : -1;
        if (aValue > bValue) return sort.desc ? -1 : 1;
        return 0;
      });
    }
    return data;
  }, [filteredData, sorting]);

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
        header: 'No',
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
        accessorKey: 'tanggal',
        header: 'Tanggal',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'namaTagihan',
        header: 'Nama Tagihan',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'totalTagihan',
        header: 'Total Tagihan',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
        ),
      },
      {
        accessorKey: 'sisaTagihan',
        header: 'Sisa Tagihan',
        size: 150,
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
      isLoading: false,
      pagination,
      sorting,
    },
    initialState: {
      density: 'compact',
    },
    enableRowNumbers: false,
    enableRowActions: true,
    positionActionsColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
      },
    },
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
    onSortingChange: setSorting,
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
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
        <Tooltip title="Riwayat Pembayaran">
          <IconButton
            size="small"
            onClick={() => handleRiwayatPembayaran(row)}
            sx={{
              color: '#2e7d32',
              '&:hover': {
                bgcolor: 'rgba(46, 125, 50, 0.08)',
              },
            }}
          >
            <MoneyRecive size={20} color="#2e7d32" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Detail">
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
            <Eye size={20} color="#1976d2" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      <MainCard sx={{ borderRadius: 0, boxShadow: 'none' }}>
        {/* Actions Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Add size={20} color="#ffffff" />}
              onClick={() => setTambahTagihanDialogOpen(true)}
              sx={{
                textTransform: 'none',
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              Tambah Data Tagihan
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<DocumentDownload size={20} color="#ffffff" />}
              onClick={() => setUnduhDialogOpen(true)}
              sx={{
                textTransform: 'none',
                bgcolor: '#1976d2',
                color: 'white',
              }}
            >
              Unduh
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPanduanDialogOpen(true)}
              sx={{
                textTransform: 'none',
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#333',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Panduan
            </Button>
          </Box>
        </Box>

        {/* FilterCollapse */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <FilterCollapse
            open={showFilters}
            onToggle={handleToggleFilters}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilter}
            buttonText="Filters"
            showLabel={false}
            hideHeader={false}
            grid={false}
            containerSx={{
              py: 2,
              px: 0,
              border: 'none',
              backgroundColor: 'transparent',
              mt: 0,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Tanggal Mulai"
                    value={filterDateRange.start}
                    onChange={(newValue) => setFilterDateRange((prev) => ({ ...prev, start: newValue }))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Tanggal Akhir"
                    value={filterDateRange.end}
                    onChange={(newValue) => setFilterDateRange((prev) => ({ ...prev, end: newValue }))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="LUNAS">LUNAS</MenuItem>
                    <MenuItem value="DICICIL">DICICIL</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </FilterCollapse>
        </Box>

        {/* Table */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
            Riwayat Penagihan
          </Typography>
          <MaterialReactTable table={table} />
        </Box>
      </MainCard>

      {/* Dialogs */}
      <PanduanTagihanPenggunaanLayananDialog
        open={panduanDialogOpen}
        onClose={() => setPanduanDialogOpen(false)}
      />
      <UnduhDataTagihanDialog
        open={unduhDialogOpen}
        onClose={() => setUnduhDialogOpen(false)}
      />
      <TambahDataTagihanDialog
        open={tambahTagihanDialogOpen}
        onClose={() => setTambahTagihanDialogOpen(false)}
      />
      <RiwayatPembayaranTagihanDialog
        open={riwayatPembayaranDialogOpen}
        onClose={() => {
          setRiwayatPembayaranDialogOpen(false);
          setSelectedTagihan(null);
        }}
        tagihan={selectedTagihan}
      />
      <DetailTagihanDialog
        open={detailTagihanDialogOpen}
        onClose={() => {
          setDetailTagihanDialogOpen(false);
          setSelectedTagihan(null);
        }}
        tagihan={selectedTagihan}
      />
    </>
  );
}
