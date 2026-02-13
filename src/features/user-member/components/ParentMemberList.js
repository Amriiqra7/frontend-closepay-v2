'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Refresh2, Lock, Edit, RepeatCircle } from 'iconsax-react';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import AlertDialog from '@/shared/ui/AlertDialog';
import { showSuccessToast } from '@/shared/utils/toast';
import ParentMemberFormDialog from './ParentMemberFormDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import ChangePasswordDialog from './ChangePasswordDialog';

// Mock data
const generateMockParentMembers = () => {
  const members = [];
  const sampleData = [
    {
      nama: 'keluargaaaa',
      username: 'keluargaaaa',
      email: 'closepay@coba.com',
      noTelp: '0942611512121',
      status: 'Aktif',
    },
    {
      nama: 'Bontot family',
      username: 'bontotfamily',
      email: 'bontot@bontot.solusi',
      noTelp: '0822222222223',
      status: 'Aktif',
    },
    {
      nama: 'yeyenfamilyyy',
      username: 'yeyenfamily',
      email: 'keluargabaruyeni@solusi.com',
      noTelp: '089647483',
      status: 'Aktif',
    },
  ];

  for (let i = 1; i <= 20; i++) {
    const baseData = sampleData[(i - 1) % sampleData.length];
    members.push({
      id: i,
      nama: `${baseData.nama} ${i > 3 ? i : ''}`.trim(),
      username: `${baseData.username}${i > 3 ? i : ''}`.trim(),
      email: `parent${i}@example.com`,
      noTelp: baseData.noTelp || `08${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      status: i % 10 === 0 ? 'Nonaktif' : 'Aktif',
    });
  }

  return members;
};

const mockParentMembers = generateMockParentMembers();

export default function ParentMemberList() {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchBy, setSearchBy] = useState('nama');
  const [statusFilter, setStatusFilter] = useState('');
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', member: null });
  const [resetPasswordDialog, setResetPasswordDialog] = useState({ open: false, member: null });
  const [changePasswordDialog, setChangePasswordDialog] = useState({ open: false, member: null });
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, member: null });

  const filteredData = useMemo(() => {
    let filtered = [...mockParentMembers];

    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((member) => {
        if (searchBy === 'nama') {
          return member.nama.toLowerCase().includes(searchLower);
        } else if (searchBy === 'username') {
          return member.username.toLowerCase().includes(searchLower);
        } else if (searchBy === 'email') {
          return member.email.toLowerCase().includes(searchLower);
        } else if (searchBy === 'noTelp') {
          return member.noTelp?.toLowerCase().includes(searchLower);
        }
        return true;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((member) => member.status === statusFilter);
    }

    return filtered;
  }, [searchValue, searchBy, statusFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'NO',
        size: 60,
        Cell: ({ row }) => {
          const pageIndex = pagination.pageIndex;
          const pageSize = pagination.pageSize;
          return pageIndex * pageSize + row.index + 1;
        },
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        size: 200,
      },
      {
        accessorKey: 'username',
        header: 'Nama Pengguna',
        size: 180,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
      },
      {
        accessorKey: 'noTelp',
        header: 'No. Telp',
        size: 150,
        Cell: ({ row }) => row.original.noTelp || '-',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        Cell: ({ row }) => (
          <Chip
            label={row.original.status}
            color={row.original.status === 'Aktif' ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Aksi',
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Reset Password" arrow>
              <IconButton
                size="small"
                onClick={() => setResetPasswordDialog({ open: true, member: row.original })}
                sx={{
                  color: '#f59e0b',
                  '&:hover': {
                    bgcolor: 'rgba(245, 158, 11, 0.08)',
                  },
                }}
              >
                <Refresh2 size={20} variant="Linear" color="#f59e0b" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ganti Password" arrow>
              <IconButton
                size="small"
                onClick={() => setChangePasswordDialog({ open: true, member: row.original })}
                sx={{
                  color: '#3b82f6',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                  },
                }}
              >
                <RepeatCircle size={20} variant="Linear" color="#3b82f6" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <IconButton
                size="small"
                onClick={() => setFormDialog({ open: true, mode: 'edit', member: row.original })}
                sx={{
                  color: '#f59e0b',
                  '&:hover': {
                    bgcolor: 'rgba(245, 158, 11, 0.08)',
                  },
                }}
              >
                <Edit size={20} variant="Linear" color="#f59e0b" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Nonaktifkan" arrow>
              <IconButton
                size="small"
                onClick={() => setDeactivateDialog({ open: true, member: row.original })}
                sx={{
                  color: '#d32f2f',
                  '&:hover': {
                    bgcolor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <Lock size={20} variant="Linear" color="#d32f2f" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [pagination]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: true,
    enableBottomToolbar: true,
    enableTopToolbar: false,
    manualPagination: false,
    manualSorting: false,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '12px !important',
        fontWeight: 600,
        color: '#374151',
        backgroundColor: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
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
      },
    },
    muiTableBodyCellProps: {
      sx: { fontSize: '12px !important' },
    },
    muiTableBodyProps: {
      sx: {
        '& tr:nth-of-type(even)': {
          backgroundColor: '#f9fafb !important',
        },
        '& tr:hover': {
          backgroundColor: '#f3f4f6 !important',
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: '#ffffff',
    }),
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={filteredData.length}
        onPageChange={(newPageIndex) => setPagination({ ...pagination, pageIndex: newPageIndex })}
        onPageSizeChange={(newPageSize) => setPagination({ ...pagination, pageSize: newPageSize, pageIndex: 0 })}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    ),
  });

  const hasActiveFilters = Boolean(searchValue || statusFilter);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setSearchBy('nama');
    setStatusFilter('');
  }, []);

  const handleAdd = useCallback(() => {
    setFormDialog({ open: true, mode: 'add', member: null });
  }, []);

  const handleLogAkunInduk = useCallback(() => {
    router.push('/admin/utama/data-user/user-member/data-user/parent-member/log');
  }, [router]);

  const handleConfirmResetPassword = useCallback(async () => {
    try {
      // TODO: Implement reset password API call
      showSuccessToast(`Password akun induk "${resetPasswordDialog.member.nama}" berhasil direset`);
      setResetPasswordDialog({ open: false, member: null });
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [resetPasswordDialog.member]);

  const handleConfirmDeactivate = useCallback(async () => {
    try {
      // TODO: Implement deactivate API call
      showSuccessToast(`Akun induk "${deactivateDialog.member.nama}" berhasil dinonaktifkan`);
      setDeactivateDialog({ open: false, member: null });
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [deactivateDialog.member]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Table Section */}
      <Box sx={{ width: '100%' }}>
        {/* Toolbar */}
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
              onClick={handleAdd}
              sx={{
                textTransform: 'none',
                bgcolor: '#9c27b0',
                '&:hover': {
                  bgcolor: '#7b1fa2',
                },
              }}
            >
              Tambah
            </Button>
            <Button
              variant="contained"
              onClick={handleLogAkunInduk}
              sx={{
                textTransform: 'none',
                bgcolor: '#3b82f6',
                '&:hover': {
                  bgcolor: '#2563eb',
                },
              }}
            >
              Log Akun Induk
            </Button>
          </Box>
        </Box>

        {/* FilterCollapse */}
        <FilterCollapse open={showFilters} hideHeader grid={false}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                size="small"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="nama">Nama</MenuItem>
                <MenuItem value="username">Nama Pengguna</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="noTelp">No. Telepon</MenuItem>
              </Select>
              <TextField
                size="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Cari berdasarkan ${searchBy === 'nama' ? 'nama' : searchBy === 'username' ? 'nama pengguna' : searchBy === 'email' ? 'email' : 'no. telepon'}`}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            <Box>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                displayEmpty
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">Semua Status</MenuItem>
                <MenuItem value="Aktif">Aktif</MenuItem>
                <MenuItem value="Nonaktif">Nonaktif</MenuItem>
              </Select>
            </Box>
          </Box>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Form Dialog */}
      <ParentMemberFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'add', member: null })}
        mode={formDialog.mode}
        member={formDialog.member}
        onSuccess={() => {
          setFormDialog({ open: false, mode: 'add', member: null });
          showSuccessToast(`Akun induk berhasil ${formDialog.mode === 'add' ? 'ditambahkan' : 'diupdate'}`);
          // TODO: Refresh data
        }}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={resetPasswordDialog.open}
        onClose={() => setResetPasswordDialog({ open: false, member: null })}
        member={resetPasswordDialog.member}
        onConfirm={handleConfirmResetPassword}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialog.open}
        onClose={() => setChangePasswordDialog({ open: false, member: null })}
        member={changePasswordDialog.member}
        onSuccess={() => {
          setChangePasswordDialog({ open: false, member: null });
          showSuccessToast('Password berhasil diubah');
        }}
      />

      {/* Deactivate Dialog */}
      <AlertDialog
        open={deactivateDialog.open}
        onClose={() => setDeactivateDialog({ open: false, member: null })}
        onConfirm={handleConfirmDeactivate}
        title="Konfirmasi Nonaktifkan"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menonaktifkan akun induk <strong>{deactivateDialog.member?.nama}</strong>?
          </Typography>
        }
        confirmText="Ya, Nonaktifkan"
        cancelText="Batal"
        confirmColor="error"
      />
    </Box>
  );
}
