'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useRouter } from 'next/navigation';
import { formatRupiah } from '@/shared/utils/format';
import KelolaSaldoDialog from './KelolaSaldoDialog';
import TablePagination from '@/shared/ui/TablePagination';

// Mock data untuk companies
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
  { id: 'aggregator-xendit', nama: 'AGGREGATOR XENDIT' },
];

// Mock data keuangan - total semua perusahaan
const mockTotalData = {
  saldoPerusahaan: 97786768,
  saldoMember: 7549448597,
  saldoMerchant: 371793128,
  tagihanPerusahaan: 75291160,
  withdrawTerpending: 5020000,
};

// Mock data keuangan per company
const mockCompanyData = {
  1: {
    saldoPerusahaan: 97786768,
    saldoMember: 7549448597,
    saldoMerchant: 371793128,
    tagihanPerusahaan: 75291160,
    withdrawTerpending: 5020000,
  },
  'aggregator-xendit': {
    saldoPerusahaan: 22000,
    saldoMember: 3601000,
    saldoMerchant: 995500,
    tagihanPerusahaan: 225000,
    withdrawTerpending: 20000,
  },
};

// Mock data transaksi
const mockTransactionData = {
  1: [
    {
      id: 1,
      tanggal: '2025-01-15',
      idTransaksi: 'TRX001',
      tipeUser: 'Member',
      namaUser: 'John Doe',
      idUser: 'USR001',
      tipeTransaksi: 'Top Up',
      status: 'Berhasil',
      nominal: 100000,
    },
    {
      id: 2,
      tanggal: '2025-01-14',
      idTransaksi: 'TRX002',
      tipeUser: 'Merchant',
      namaUser: 'Jane Smith',
      idUser: 'USR002',
      tipeTransaksi: 'Payment',
      status: 'Berhasil',
      nominal: 250000,
    },
  ],
  'aggregator-xendit': [],
};

export default function ManajemenKeuanganList() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [kelolaDialog, setKelolaDialog] = useState({ open: false, type: null }); // 'member' or 'merchant'
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  // Get financial data based on selected company
  const financialData = useMemo(() => {
    if (selectedCompany) {
      return mockCompanyData[selectedCompany.id] || mockTotalData;
    }
    return mockTotalData;
  }, [selectedCompany]);

  // Get transaction data
  const transactionData = useMemo(() => {
    if (selectedCompany) {
      return mockTransactionData[selectedCompany.id] || [];
    }
    return [];
  }, [selectedCompany]);


  const handleKelola = (type) => {
    // Only open dialog for member and merchant
    if (type === 'member' || type === 'merchant') {
      setKelolaDialog({ open: true, type });
    } else if (type === 'tagihan' && selectedCompany) {
      // Redirect to tagihan perusahaan page
      router.push(`/manajemen-keuangan/tagihan-perusahaan/${selectedCompany.id}`);
    } else {
      // TODO: Handle other types (withdraw) - maybe navigate to different page
      console.log('Kelola clicked for:', type);
    }
  };

  const handleConfirmKelola = () => {
    // TODO: Implement logic for kelola saldo
    console.log('Confirm kelola:', kelolaDialog.type);
    setKelolaDialog({ open: false, type: null });
  };

  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
  };

  const getBannerText = () => {
    if (selectedCompany) {
      return `Anda melihat data keuangan dari ${selectedCompany.nama}`;
    }
    return 'Anda melihat data keuangan dari seluruh perusahaan';
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return transactionData;

    const sorted = [...transactionData];
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
  }, [transactionData, sorting]);

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
        accessorKey: 'tanggal',
        header: 'Tanggal',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'idTransaksi',
        header: 'ID Transaksi',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tipeUser',
        header: 'Tipe User',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'namaUser',
        header: 'Nama User',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'idUser',
        header: 'ID User',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tipeTransaksi',
        header: 'Tipe Transaksi',
        size: 150,
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
        accessorKey: 'nominal',
        header: 'Nominal',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{formatCurrency(cell.getValue())}</Typography>
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
  });

  return (
    <>
      <Box sx={{ width: '100%', height: '100%' }}>
        {/* Header Controls */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Pilih Company
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
                  setPagination({ pageIndex: 0, pageSize: 10 });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Pilih company"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        {/* Info Banner */}
        <Alert
          severity="info"
          sx={{
            borderRadius: 0,
            bgcolor: '#e3f2fd',
            color: '#1976d2',
            '& .MuiAlert-icon': {
              color: '#1976d2',
            },
          }}
        >
          {getBannerText()}
        </Alert>

        {/* Financial Cards */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: selectedCompany ? '1fr' : 'repeat(2, 1fr)',
                md: selectedCompany ? '1fr' : 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {!selectedCompany ? (
              <>
                {/* Saldo Perusahaan */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: 'none',
                    height: '100%',
                    boxShadow: 'none',
                    bgcolor: '#f3f7ff',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#1976d2', fontWeight: 500 }}>
                      Saldo Perusahaan
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#1976d2' }}>
                      {formatCurrency(financialData.saldoPerusahaan)}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Saldo Member */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: 'none',
                    height: '100%',
                    boxShadow: 'none',
                    bgcolor: '#f1f8f4',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#2e7d32', fontWeight: 500 }}>
                      Saldo Member
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#2e7d32' }}>
                      {formatCurrency(financialData.saldoMember)}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Saldo Merchant */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: 'none',
                    height: '100%',
                    boxShadow: 'none',
                    bgcolor: '#fff4e6',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#ed6c02', fontWeight: 500 }}>
                      Saldo Merchant
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#ed6c02' }}>
                      {formatCurrency(financialData.saldoMerchant)}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Tagihan Perusahaan */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: 'none',
                    height: '100%',
                    boxShadow: 'none',
                    bgcolor: '#f3e5f5',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#9c27b0', fontWeight: 500 }}>
                      Tagihan Perusahaan
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#9c27b0' }}>
                      {formatCurrency(financialData.tagihanPerusahaan)}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Withdraw Perusahaan Terpending */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: 'none',
                    height: '100%',
                    boxShadow: 'none',
                    bgcolor: '#fce4ec',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#ec407a', fontWeight: 500 }}>
                      Withdraw Perusahaan Terpending
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#ec407a' }}>
                      {formatCurrency(financialData.withdrawTerpending)}
                    </Typography>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Tagihan Perusahaan - Only show when company is selected */
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: 'none',
                  height: '100%',
                  boxShadow: 'none',
                  bgcolor: '#f3e5f5',
                }}
              >
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: '#9c27b0', fontWeight: 500 }}>
                    Tagihan Perusahaan
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 1, color: '#9c27b0' }}>
                    {formatCurrency(financialData.tagihanPerusahaan)}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleKelola('tagihan')}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#9c27b0',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      px: 2,
                      py: 0.5,
                      mt: 0.5,
                      '&:hover': {
                        bgcolor: '#7b1fa2',
                      },
                    }}
                  >
                    Kelola
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* Table - Only show when company is selected */}
        {selectedCompany && (
          <Box sx={{ p: 2, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
              Keuntungan Solusi Negeri
            </Typography>
            <Box sx={{ pb: 4 }}>
              <MaterialReactTable table={table} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Kelola Saldo Dialog */}
      <KelolaSaldoDialog
        open={kelolaDialog.open}
        onClose={() => setKelolaDialog({ open: false, type: null })}
        onConfirm={handleConfirmKelola}
        type={kelolaDialog.type}
        companyName={selectedCompany?.nama}
      />
    </>
  );
}
