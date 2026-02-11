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
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Eye, Edit, Trash } from 'iconsax-react';
import { usePathname, useRouter } from 'next/navigation';
import TablePagination from '@/components/TablePagination';
import AlertDialog from '@/components/AlertDialog';
import FilterCollapse, { FilterButton } from '@/components/FilterCollapse';

// Sample data based on the image
const generateMockDataIzinAkses = () => {
  return [
    {
      id: 1,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Activate or Deactivate Admin',
      kode: 'user_membership_activate_deactivate_admin',
      deskripsi: 'Membersip Activate or Deactivate Admin (user_membership_activate_deactivate_admin)',
      status: 'aktif',
    },
    {
      id: 2,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Create Admin',
      kode: 'user_membership_create_admin',
      deskripsi: 'Membersip Create Admin (user_membership_create_admin)',
      status: 'aktif',
    },
    {
      id: 3,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Get Admin',
      kode: 'user_membership_get_admin',
      deskripsi: 'Membersip Get Admin (user_membership_get_admin)',
      status: 'aktif',
    },
    {
      id: 4,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Grant Role Admin',
      kode: 'user_membership_grant_role_admin',
      deskripsi: 'Membersip Grant Role Admin (user_membership_grant_role_admin)',
      status: 'aktif',
    },
    {
      id: 5,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Revoke Role Admin',
      kode: 'user_membership_revoke_role_admin',
      deskripsi: 'Membersip Revoke Role Admin (user_membership_revoke_role_admin)',
      status: 'aktif',
    },
    {
      id: 6,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Update Admin',
      kode: 'user_membership_update_admin',
      deskripsi: 'Membersip Update Admin (user_membership_update_admin)',
      status: 'aktif',
    },
    {
      id: 7,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Remove Security Code Member',
      kode: 'user_membership_remove_security_code_member',
      deskripsi: 'Membership Remove Security Code Member (user_membership_remove_security_code_member)',
      status: 'aktif',
    },
    {
      id: 8,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Reset Password Member',
      kode: 'user_membership_reset_password_member',
      deskripsi: 'Membership Reset Password Member (user_membership_reset_password_member)',
      status: 'aktif',
    },
    {
      id: 9,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Set Parent Member',
      kode: 'user_membership_set_parent_member',
      deskripsi: 'Membership Set Parent Member (user_membership_set_parent_member)',
      status: 'aktif',
    },
    {
      id: 10,
      service: 'user',
      tipe: 'admin',
      nama: 'Membersip Activate or Deactivate Member',
      kode: 'user_membership_activate_deactivate_member',
      deskripsi: 'Membersip Activate or Deactivate Member (user_membership_activate_deactivate_member)',
      status: 'aktif',
    },
    {
      id: 11,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Create Member',
      kode: 'user_membership_create_member',
      deskripsi: 'Membership Create Member (user_membership_create_member)',
      status: 'aktif',
    },
    {
      id: 12,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Get Member',
      kode: 'user_membership_get_member',
      deskripsi: 'Membership Get Member (user_membership_get_member)',
      status: 'aktif',
    },
    {
      id: 13,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Update Member',
      kode: 'user_membership_update_member',
      deskripsi: 'Membership Update Member (user_membership_update_member)',
      status: 'aktif',
    },
    {
      id: 14,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Grant Role Member',
      kode: 'user_membership_grant_role_member',
      deskripsi: 'Membership Grant Role Member (user_membership_grant_role_member)',
      status: 'aktif',
    },
    {
      id: 15,
      service: 'user',
      tipe: 'admin',
      nama: 'Membership Revoke Role Member',
      kode: 'user_membership_revoke_role_member',
      deskripsi: 'Membership Revoke Role Member (user_membership_revoke_role_member)',
      status: 'aktif',
    },
    {
      id: 16,
      service: 'user',
      tipe: 'member',
      nama: 'Membership View Profile',
      kode: 'user_membership_view_profile',
      deskripsi: 'Membership View Profile (user_membership_view_profile)',
      status: 'aktif',
    },
    {
      id: 17,
      service: 'user',
      tipe: 'member',
      nama: 'Membership Edit Profile',
      kode: 'user_membership_edit_profile',
      deskripsi: 'Membership Edit Profile (user_membership_edit_profile)',
      status: 'aktif',
    },
    {
      id: 18,
      service: 'user',
      tipe: 'member',
      nama: 'Membership Change Password',
      kode: 'user_membership_change_password',
      deskripsi: 'Membership Change Password (user_membership_change_password)',
      status: 'aktif',
    },
    {
      id: 19,
      service: 'user',
      tipe: 'member',
      nama: 'Membership View Transactions',
      kode: 'user_membership_view_transactions',
      deskripsi: 'Membership View Transactions (user_membership_view_transactions)',
      status: 'aktif',
    },
    {
      id: 20,
      service: 'user',
      tipe: 'member',
      nama: 'Membership View Balance',
      kode: 'user_membership_view_balance',
      deskripsi: 'Membership View Balance (user_membership_view_balance)',
      status: 'aktif',
    },
    {
      id: 21,
      service: 'transaction',
      tipe: 'admin',
      nama: 'Transaction Create Admin',
      kode: 'transaction_create_admin',
      deskripsi: 'Transaction Create Admin (transaction_create_admin)',
      status: 'aktif',
    },
    {
      id: 22,
      service: 'transaction',
      tipe: 'admin',
      nama: 'Transaction Get Admin',
      kode: 'transaction_get_admin',
      deskripsi: 'Transaction Get Admin (transaction_get_admin)',
      status: 'aktif',
    },
    {
      id: 23,
      service: 'transaction',
      tipe: 'admin',
      nama: 'Transaction Update Admin',
      kode: 'transaction_update_admin',
      deskripsi: 'Transaction Update Admin (transaction_update_admin)',
      status: 'aktif',
    },
    {
      id: 24,
      service: 'transaction',
      tipe: 'admin',
      nama: 'Transaction Delete Admin',
      kode: 'transaction_delete_admin',
      deskripsi: 'Transaction Delete Admin (transaction_delete_admin)',
      status: 'aktif',
    },
  ];
};

const mockDataIzinAkses = generateMockDataIzinAkses();

export default function DataIzinAksesList() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(mockDataIzinAkses.length);
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
    
    // Update columnFilters for 'nama' field
    if (value) {
      setColumnFilters([{ id: 'nama', value }]);
    } else {
      setColumnFilters([]);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setColumnFilters([]);
  }, []);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: '',
  });

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0,
    [columnFilters]
  );

  // Filter data based on columnFilters
  const filteredData = useMemo(() => {
    let filtered = [...mockDataIzinAkses];

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

  const handleView = useCallback((item) => {
    // TODO: Implement view functionality
    console.log('View data izin akses:', item);
  }, []);

  const handleEdit = useCallback((item) => {
    // TODO: Implement edit functionality
    console.log('Edit data izin akses:', item);
    // router.push(`${pathname}/edit/${item.id}`);
  }, []);

  const handleDelete = useCallback((item) => {
    setDeleteDialog({
      open: true,
      id: item.id,
      name: item.nama,
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    // TODO: Implement delete functionality
    console.log('Delete data izin akses:', deleteDialog.id);
    setDeleteDialog({ open: false, id: null, name: '' });
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
        accessorKey: 'service',
        header: 'Service',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tipe',
        header: 'Tipe',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
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
        accessorKey: 'kode',
        header: 'Kode',
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
        size: 400,
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
          return (
            <Chip
              label="Aktif"
              size="small"
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '100%',
        flex: 1,
        overflow: 'auto',
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
        <IconButton
          size="small"
          color="info"
          onClick={() => handleView(row.original)}
        >
          <Eye size={20} variant="Linear" />
        </IconButton>
        <IconButton
          size="small"
          color="success"
          onClick={() => handleEdit(row.original)}
        >
          <Edit size={20} variant="Linear" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(row.original)}
        >
          <Trash size={20} variant="Linear" />
        </IconButton>
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Cari nama atau kode izin akses..."
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
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
            backgroundColor: 'white',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
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
    </>
  );
}
