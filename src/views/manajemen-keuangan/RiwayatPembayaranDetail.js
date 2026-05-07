'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DocumentDownload, Eye, CloseCircle } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';
import MainCard from '@/shared/ui/MainCard';
import TablePagination from '@/shared/ui/TablePagination';
import UnduhDataTagihanDialog from './UnduhDataTagihanDialog';
import DetailPembayaranDialog from './DetailPembayaranDialog';

// Mock data untuk company
const mockCompanyData = {
  1: { id: 1, nama: 'DEMO QUALITY ASSURANCE' },
  'aggregator-xendit': { id: 'aggregator-xendit', nama: 'AGGREGATOR XENDIT' },
};

// Mock data riwayat pembayaran
const mockRiwayatPembayaranData = {
  1: [
    {
      id: 1,
      tanggalVerifikasi: '2026-02-20 18:28:03',
      bulanTagihan: 'Februari 2026',
      nominalTerverifikasi: 10000,
    },
  ],
};

export default function RiwayatPembayaranDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = params?.companyId;
  const tagihanId = searchParams?.get('tagihanId');
  const company = mockCompanyData[companyId] || { id: companyId, nama: 'Unknown Company' };

  const [unduhDialogOpen, setUnduhDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPembayaran, setSelectedPembayaran] = useState(null);
  const [filterBulan, setFilterBulan] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // Filter data berdasarkan bulan
  const filteredData = useMemo(() => {
    let data = mockRiwayatPembayaranData[companyId] || [];
    if (filterBulan) {
      const monthYear = filterBulan.format('MMMM YYYY');
      data = data.filter((item) => item.bulanTagihan.toLowerCase().includes(monthYear.toLowerCase()));
    }
    return data;
  }, [companyId, filterBulan]);

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


  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
  };

  const handleDetail = (row) => {
    setSelectedPembayaran(row.original);
    setDetailDialogOpen(true);
  };

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
        accessorKey: 'tanggalVerifikasi',
        header: 'Tanggal Verifikasi',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'bulanTagihan',
        header: 'Bulan Tagihan',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'nominalTerverifikasi',
        header: 'Nominal Terverifikasi',
        size: 180,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
        ),
      },
      {
        id: 'aksi',
        header: 'Aksi',
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
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
      },
    ],
    []
  );

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

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
    enableRowActions: false,
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
  });

  return (
    <>
      <Box sx={{ width: '100%', height: '100%', backgroundColor: '#f8f9fa' }}>
        {/* Content */}
        <MainCard>
          {/* Filter and Actions */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month']}
                  openTo="month"
                  value={filterBulan}
                  onChange={(newValue) => setFilterBulan(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      placeholder: 'Pilih Bulan',
                      sx: { minWidth: 200 },
                    },
                  }}
                  format="MMMM YYYY"
                />
              </LocalizationProvider>
              {filterBulan && (
                <Button
                  variant="outlined"
                  onClick={() => setFilterBulan(null)}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#c62828',
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                    },
                  }}
                >
                  Reset
                </Button>
              )}
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<DocumentDownload size={20} color="#ffffff" />}
                onClick={() => setUnduhDialogOpen(true)}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#1976d2',
                  color: 'white',
                  px: 2,
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                }}
              >
                Unduh
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ p: 2 }}>
            <MaterialReactTable table={table} />
          </Box>
        </MainCard>
      </Box>

      {/* Dialogs */}
      <UnduhDataTagihanDialog
        open={unduhDialogOpen}
        onClose={() => setUnduhDialogOpen(false)}
      />
      <DetailPembayaranDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedPembayaran(null);
        }}
        pembayaran={selectedPembayaran}
      />
    </>
  );
}
