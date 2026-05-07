'use client';

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Eye, Edit, Trash, Setting2, Menu, Login } from 'iconsax-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import TablePagination from '@/shared/ui/TablePagination';
import AlertDialog from '@/shared/ui/AlertDialog';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import CompanyDetailDialog from './CompanyDetailDialog';
import CompanySettingsDialog from './CompanySettingsDialog';
import CompanyMenuSettingsDialog from './CompanyMenuSettingsDialog';
import { handleDeleteWithToast } from '@/shared/utils/toast';

// Sample data - replace with actual API call
// Generate 100 mock companies for testing pagination
const generateMockCompanies = () => {
  const companies = [];
  const sampleData = [
    {
      nama: 'Bougenvile Blok',
      inisialPerusahaan: 'BB',
      namaPIC: 'Arik Riko Prasetya',
      emailPIC: 'ArikRikoPrasetya@gmail.com',
    },
    {
      nama: 'Kantin FKi 12',
      inisialPerusahaan: 'KF12',
      namaPIC: 'John Doe',
      emailPIC: 'john.doe@example.com',
    },
  ];

  // Generate 100 companies
  for (let i = 1; i <= 100; i++) {
    const baseData = sampleData[(i - 1) % sampleData.length];
    companies.push({
      id: i,
      nama: i <= sampleData.length ? baseData.nama : `${baseData.nama} ${Math.floor(i / sampleData.length)}`,
      inisialPerusahaan: baseData.inisialPerusahaan,
      namaPIC: baseData.namaPIC,
      emailPIC: baseData.emailPIC,
      logo: null, // Placeholder for logo
      address: `Jl. Contoh No. ${i}, Kota Contoh`,
      financialType: i % 2 === 0 ? "Outlet 23" : "Pandawa",
      billingAccount: i % 2 === 0 ? "Pandawa" : "Outlet 23",
      picPhone: `08123456789${i}`,
      picUsername: `pic${i}`,
      picPassword: "password123",
      homepage: "Dashboard",
      companyMenus: {
        Dashboard: true,
        Transaksi: true,
        Laporan: i % 2 === 0,
        Pengaturan: true,
        Manajemen: i % 2 === 0,
        Keuangan: true,
        Pengguna: i % 2 === 0,
      },
    });
  }

  return companies;
};

const mockCompanies = generateMockCompanies();

export default function Company() {
  const router = useRouter();
  const pathname = usePathname();
  const { setAdminMenu } = useAdminMenu();
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(mockCompanies.length);
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [companyInitialFilter, setCompanyInitialFilter] = useState('');
  const [detailDialog, setDetailDialog] = useState({ open: false, company: null });
  const [settingsDialog, setSettingsDialog] = useState({ open: false, company: null });
  const [menuSettingsDialog, setMenuSettingsDialog] = useState({ open: false, company: null });

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
    if (companyInitialFilter) {
      filters.push({ id: 'inisialPerusahaan', value: companyInitialFilter });
    }
    setColumnFilters(filters);
  }, [companyInitialFilter]);

  const handleCompanyInitialFilterChange = useCallback((event) => {
    const value = event.target.value;
    setCompanyInitialFilter(value);
    
    // Update columnFilters
    const filters = [];
    if (searchValue) {
      filters.push({ id: 'nama', value: searchValue });
    }
    if (value) {
      filters.push({ id: 'inisialPerusahaan', value });
    }
    setColumnFilters(filters);
  }, [searchValue]);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setCompanyInitialFilter('');
    setColumnFilters([]);
  }, []);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: '',
  });

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || searchValue || companyInitialFilter,
    [columnFilters, searchValue, companyInitialFilter]
  );

  // Filter data based on columnFilters
  const filteredData = useMemo(() => {
    let filtered = [...mockCompanies];

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

  const handleView = useCallback((company) => {
    setDetailDialog({ open: true, company });
  }, []);

  const handleAturMenu = useCallback((company) => {
    setMenuSettingsDialog({
      open: true,
      company: company,
    });
  }, []);

  const handlePengaturanPerusahaan = useCallback((company) => {
    setSettingsDialog({
      open: true,
      company: company,
    });
  }, []);

  const handleMasukKeCompany = useCallback((company) => {
    // Set admin menu to 'advance' and company
    setAdminMenu('advance', company);
    
    if (typeof window !== 'undefined') {
      // Push a dummy state first to create a barrier
      window.history.pushState(null, '', window.location.href);
      // Then navigate using replace
      router.replace('/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [router, setAdminMenu]);

  const handleEdit = useCallback((company) => {
    router.push(`${pathname}/${company.id}/edit`);
  }, [router, pathname]);

  const handleDelete = useCallback((company) => {
    setDeleteDialog({
      open: true,
      id: company.id,
      name: company.nama,
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const deletePromise = CompanyAPI.delete(deleteDialog.id);
      
      // Simulate API call
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Delete company:', deleteDialog.id);
          // Simulate random error for testing (remove in production)
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Perusahaan',
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
        accessorKey: 'nama',
        header: 'Nama',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'inisialPerusahaan',
        header: 'Inisial Perusahaan',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'namaPIC',
        header: 'Nama PIC',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'emailPIC',
        header: 'Email PIC',
        size: 250,
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
      },
    },
    renderRowActions: ({ row }) => (
      <Box 
        display="flex" 
        gap={0.5}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Tooltip title="Detail" arrow>
          <IconButton
            size="small"
            onClick={() => handleView(row.original)}
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
        <Tooltip title="Pengaturan Perusahaan" arrow>
          <IconButton
            size="small"
            onClick={() => handlePengaturanPerusahaan(row.original)}
            sx={{
              color: '#9c27b0',
              '&:hover': {
                bgcolor: 'rgba(156, 39, 176, 0.08)',
              },
            }}
          >
            <Setting2 size={20} variant="Linear" color="#9c27b0" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Atur Menu" arrow>
          <IconButton
            size="small"
            onClick={() => handleAturMenu(row.original)}
            sx={{
              color: '#00bcd4',
              '&:hover': {
                bgcolor: 'rgba(0, 188, 212, 0.08)',
              },
            }}
          >
            <Menu size={20} variant="Linear" color="#00bcd4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Masuk ke Company" arrow>
          <IconButton
            size="small"
            onClick={() => handleMasukKeCompany(row.original)}
            sx={{
              color: '#2e7d32',
              '&:hover': {
                bgcolor: 'rgba(46, 125, 50, 0.08)',
              },
            }}
          >
            <Login size={20} variant="Linear" color="#2e7d32" />
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
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Cari perusahaan..."
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Cari Company Initial..."
              value={companyInitialFilter}
              onChange={handleCompanyInitialFilterChange}
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

      {/* Detail Dialog */}
      <CompanyDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, company: null })}
        company={detailDialog.company}
      />

      {/* Settings Dialog */}
      <CompanySettingsDialog
        open={settingsDialog.open}
        onClose={() => setSettingsDialog({ open: false, company: null })}
        companyName={settingsDialog.company?.nama}
        companyId={settingsDialog.company?.id}
        onMenuClick={(menuId, companyId) => {
          if (menuId === 'credential-rekening' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/credential-rekening`);
          } else if (menuId === 'kustom-nama-saldo' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/kustom-nama-saldo`);
          } else if (menuId === 'topup-va' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-topup-va`);
          } else if (menuId === 'waktu-withdrawal' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-waktu-withdrawal`);
          } else if (menuId === 'limit-topup' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/atur-limit-topup`);
          } else if (menuId === 'auto-payment' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-auto-payment-invoice`);
          } else if (menuId === 'perizinan-login' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/perizinan-login-user`);
          } else if (menuId === 'settlement-qris' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-waktu-settlement-qris`);
          } else if (menuId === 'icon-powered-by' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-icon-powered-by`);
          } else if (menuId === 'kekuatan-password' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-kekuatan-kata-sandi`);
          } else if (menuId === 'akun-induk' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-akun-induk`);
          } else if (menuId === 'penawaran-email-telepon' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-penawaran-email-telepon`);
          } else if (menuId === 'otp-login' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-perizinan-otp-login`);
          } else if (menuId === 'kustom-nama-pengirim' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-kustom-nama-pengirim-email`);
          } else if (menuId === 'google-login' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-login-member-google`);
          } else if (menuId === 'akun-peran-hak-akses' && companyId) {
            setSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/konfigurasi-akun-peran-hak-akses`);
          } else {
            console.log('Settings menu clicked:', menuId, 'for company:', settingsDialog.company);
            // TODO: Implement navigation or action based on menuId
          }
        }}
      />

      {/* Menu Settings Dialog */}
      <CompanyMenuSettingsDialog
        open={menuSettingsDialog.open}
        onClose={() => setMenuSettingsDialog({ open: false, company: null })}
        companyName={menuSettingsDialog.company?.nama}
        companyId={menuSettingsDialog.company?.id}
        onMenuClick={(menuId, companyId) => {
          if (menuId === 'nama-menu-web-admin' && companyId) {
            setMenuSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/atur-nama-menu-web-admin`);
          } else if (menuId === 'nama-menu-app-member' && companyId) {
            setMenuSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/atur-nama-menu-app-member`);
          } else if (menuId === 'nama-menu-app-merchant' && companyId) {
            setMenuSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/atur-nama-menu-app-merchant`);
          } else if (menuId === 'menu-app-member' && companyId) {
            setMenuSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/atur-menu-app-member`);
          } else if (menuId === 'menu-app-merchant' && companyId) {
            setMenuSettingsDialog({ open: false, company: null });
            router.push(`${pathname}/${companyId}/atur-menu-app-merchant`);
          } else {
            console.log('Menu settings clicked:', menuId, 'for company:', menuSettingsDialog.company);
          }
        }}
      />
    </>
  );
}
