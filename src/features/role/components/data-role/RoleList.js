'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Eye, Edit, Trash } from 'iconsax-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TablePagination from '@/shared/ui/TablePagination';
import AlertDialog from '@/shared/ui/AlertDialog';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import PageLoading from '@/shared/ui/PageLoading';
import RoleDetailDialog from './RoleDetailDialog';
import { handleDeleteWithToast } from '@/shared/utils/toast';

// Sample data - replace with actual API call
// Generate 100 mock roles for testing pagination
const generateMockRoles = () => {
  const roles = [];
  const sampleData = [
    {
      nama: 'Administrator',
      deskripsi: 'Akses penuh ke semua fitur sistem',
      jumlahPengguna: 5,
      companyId: 1,
    },
    {
      nama: 'Manager',
      deskripsi: 'Akses untuk mengelola data perusahaan',
      jumlahPengguna: 12,
      companyId: 1,
    },
    {
      nama: 'Operator',
      deskripsi: 'Akses untuk input dan melihat data',
      jumlahPengguna: 25,
      companyId: 2,
    },
    {
      nama: 'Viewer',
      deskripsi: 'Hanya dapat melihat data',
      jumlahPengguna: 8,
      companyId: 2,
    },
  ];

  // Generate 100 roles dengan companyId yang berbeda-beda
  const userTypes = ['Superadmin', 'Admin', 'Member', 'Merchant'];
  const mockPermissions = [
    { id: 1, nama: 'Lihat Dashboard' },
    { id: 2, nama: 'Kelola User' },
    { id: 3, nama: 'Kelola Transaksi' },
    { id: 4, nama: 'Lihat Laporan' },
    { id: 5, nama: 'Kelola Pengaturan' },
  ];
  
  for (let i = 1; i <= 100; i++) {
    const baseData = sampleData[(i - 1) % sampleData.length];
    // Random permissions untuk setiap role
    const randomPermissions = mockPermissions
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2);
    
    roles.push({
      id: i,
      nama: i <= sampleData.length ? baseData.nama : `${baseData.nama} ${Math.floor(i / sampleData.length)}`,
      deskripsi: baseData.deskripsi,
      jumlahPengguna: baseData.jumlahPengguna + Math.floor(Math.random() * 10),
      companyId: baseData.companyId + Math.floor((i - 1) / 25) % 4, // Distribute across companies
      jenisUser: userTypes[i % userTypes.length], // Add jenisUser field
      izinKeamanan: randomPermissions, // Add izinKeamanan field
    });
  }

  return roles;
};

const mockRoles = generateMockRoles();

export default function RoleList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const companyId = searchParams?.get('companyId');
  
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(mockRoles.length);
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount (client-side only) to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect ke halaman pemilihan company jika tidak ada companyId
  useEffect(() => {
    if (!isMounted) return;
    if (searchParams && !companyId) {
      setIsLoading(true);
      router.push('/role/data-role');
    }
  }, [companyId, router, searchParams, isMounted]);

  // Loading state saat companyId berubah
  useEffect(() => {
    if (!isMounted) return;
    if (companyId) {
      setIsLoading(true);
      // Simulate loading saat data dimuat (bisa diganti dengan actual API call)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [companyId, isMounted]);

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
    if (userTypeFilter) {
      filters.push({ id: 'jenisUser', value: userTypeFilter });
    }
    setColumnFilters(filters);
  }, [userTypeFilter]);

  const handleUserTypeFilterChange = useCallback((event) => {
    const value = event.target.value;
    setUserTypeFilter(value);
    
    // Update columnFilters
    const filters = [];
    if (searchValue) {
      filters.push({ id: 'nama', value: searchValue });
    }
    if (value) {
      filters.push({ id: 'jenisUser', value });
    }
    setColumnFilters(filters);
  }, [searchValue]);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setUserTypeFilter('');
    setColumnFilters([]);
  }, []);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: '',
  });

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || searchValue || userTypeFilter,
    [columnFilters, searchValue, userTypeFilter]
  );

  // Filter data based on columnFilters and companyId
  const filteredData = useMemo(() => {
    let filtered = [...mockRoles];

    // Filter by companyId first
    if (companyId) {
      filtered = filtered.filter((item) => item.companyId === parseInt(companyId));
    }

    // Then apply column filters
    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || '';
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [columnFilters, companyId]);

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

  const [detailDialog, setDetailDialog] = useState({ open: false, role: null });

  const handleView = useCallback((role) => {
    setDetailDialog({
      open: true,
      role: role,
    });
  }, []);

  const handleEdit = useCallback((role) => {
    if (companyId) {
      router.push(`${pathname.replace('/list', '')}/${role.id}/edit?companyId=${companyId}`);
    } else {
      router.push(`${pathname.replace('/list', '')}/${role.id}/edit`);
    }
  }, [router, pathname, companyId]);

  const handleDelete = useCallback((role) => {
    setDeleteDialog({
      open: true,
      id: role.id,
      name: role.nama,
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const deletePromise = RoleAPI.delete(deleteDialog.id);
      
      // Simulate API call
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Delete role:', deleteDialog.id);
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
        'Peran Hak Akses',
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
    if (companyId) {
      router.push(`${pathname.replace('/list', '')}/new?companyId=${companyId}`);
    } else {
      router.push(`${pathname.replace('/list', '')}/new`);
    }
  }, [router, pathname, companyId]);

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
        header: 'Nama Peran',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'jumlahPengguna',
        header: 'Jumlah Pengguna',
        size: 150,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center">
            {cell.getValue()}
          </Typography>
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
      <Box display="flex">
        <Tooltip title="Detail" arrow>
          <IconButton
            size="small"
            color="info"
            onClick={() => handleView(row.original)}
          >
            <Eye size={20} variant="Linear" />
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

  // Tampilkan loading saat belum mounted atau saat redirect/loading data
  if (!isMounted || isLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <Box>
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
              placeholder="Cari peran hak akses..."
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
            <Select
              value={userTypeFilter}
              onChange={handleUserTypeFilterChange}
              displayEmpty
              fullWidth
              size="small"
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary' }}>Jenis User</Typography>;
                }
                return selected;
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
              <MenuItem value="Superadmin">Superadmin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
              <MenuItem value="Merchant">Merchant</MenuItem>
            </Select>
          </Grid>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 4 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Detail Dialog */}
      <RoleDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, role: null })}
        role={detailDialog.role}
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
