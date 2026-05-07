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
  Autocomplete,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Eye, Edit, Archive, Refresh2, DocumentUpload, DocumentDownload, Bank } from 'iconsax-react';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import AlertDialog from '@/shared/ui/AlertDialog';
import { showSuccessToast } from '@/shared/utils/toast';
import UploadDataTermsDialog from './UploadDataTermsDialog';
import UploadDataDialog from './UploadDataDialog';
import DownloadDataDialog from './DownloadDataDialog';
import UserMerchantDetailDialog from './UserMerchantDetailDialog';

// Mock tags options
const tagsOptions = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Premium', 'Standard', 'Basic'];

// Sample data - replace with actual API call
const generateMockMerchants = () => {
  const merchants = [];
  const sampleData = [
    {
      nama: 'Merchant 1',
      noId: 'MER001',
      email: 'merchant1@example.com',
      username: 'merchant1',
      noTelp: '0823295123',
      status: 'Aktif',
      jenisIdentitas: 'ktp',
      noIdentitas: '1234567890',
      jenisKelamin: 'laki-laki',
      tanggalLahir: new Date('1990-01-01'),
      tempatLahir: 'Jakarta',
      alamat: 'Jl. Contoh No. 123',
    },
    {
      nama: 'Merchant 2',
      noId: 'MER002',
      email: 'merchant2@example.com',
      username: 'merchant2',
      noTelp: '082231381528',
      status: 'Aktif',
      jenisIdentitas: 'sim',
      noIdentitas: '0987654321',
      jenisKelamin: 'perempuan',
      tanggalLahir: new Date('1992-05-15'),
      tempatLahir: 'Bandung',
      alamat: 'Jl. Contoh No. 456',
    },
    {
      nama: 'Merchant 3',
      noId: 'MER003',
      email: 'merchant3@example.com',
      username: 'merchant3',
      noTelp: '081234567890',
      status: 'Aktif',
      jenisIdentitas: 'passport',
      noIdentitas: 'A1234567',
      jenisKelamin: 'laki-laki',
      tanggalLahir: new Date('1988-12-20'),
      tempatLahir: 'Surabaya',
      alamat: 'Jl. Contoh No. 789',
    },
  ];

  // Mock role accesses untuk merchant
  const mockRoleAccesses = [
    {
      id: 1,
      tipe: 'Admin',
      nama: 'Admin - Merchant Full Control',
      deskripsi: 'Admin dengan akses penuh untuk merchant',
      status: 'Aktif',
      diizinkan: true,
    },
    {
      id: 2,
      tipe: 'Admin Sub Company',
      nama: 'Admin Sub Company - Merchant Read Only',
      deskripsi: 'Admin sub company dengan akses read only untuk merchant',
      status: 'Aktif',
      diizinkan: true,
    },
    {
      id: 3,
      tipe: 'Admin',
      nama: 'Admin - Merchant Management',
      deskripsi: 'Admin untuk mengelola merchant',
      status: 'Aktif',
      diizinkan: true,
    },
  ];

  for (let i = 1; i <= 50; i++) {
    const baseData = sampleData[(i - 1) % sampleData.length];
    merchants.push({
      id: i,
      nama: `${baseData.nama} ${i > 3 ? i : ''}`.trim(),
      noId: `${baseData.noId}${String(i).padStart(3, '0')}`,
      email: `merchant${i}@example.com`,
      username: `${baseData.username}${i}`,
      noTelp: `08${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      status: i % 10 === 0 ? 'Arsip' : 'Aktif',
      tags: tagsOptions[i % tagsOptions.length],
      jenisIdentitas: baseData.jenisIdentitas,
      noIdentitas: baseData.noIdentitas,
      jenisKelamin: baseData.jenisKelamin,
      tanggalLahir: baseData.tanggalLahir,
      tempatLahir: baseData.tempatLahir,
      alamat: baseData.alamat,
      roleAccesses: i % 3 === 0 
        ? [mockRoleAccesses[0], mockRoleAccesses[1]] 
        : i % 3 === 1 
        ? [mockRoleAccesses[0], mockRoleAccesses[2]] 
        : [mockRoleAccesses[1], mockRoleAccesses[2]],
    });
  }

  return merchants;
};

const mockMerchants = generateMockMerchants();

export default function UserMerchantList() {
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
  const [tagsFilter, setTagsFilter] = useState(null);
  const [uploadTermsDialogOpen, setUploadTermsDialogOpen] = useState(false);
  const [uploadDataDialogOpen, setUploadDataDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [detailDialog, setDetailDialog] = useState({ open: false, merchant: null });
  const [archiveDialog, setArchiveDialog] = useState({ open: false, merchant: null });
  const [resetPasswordDialog, setResetPasswordDialog] = useState({ open: false, merchant: null });

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

    const filters = [];
    if (value) {
      filters.push({ id: searchBy, value });
    }
    if (statusFilter) {
      filters.push({ id: 'status', value: statusFilter });
    }
    setColumnFilters(filters);
  }, [searchBy, statusFilter]);

  const handleSearchByChange = useCallback((event) => {
    setSearchBy(event.target.value);
    setSearchValue('');
    setColumnFilters(statusFilter ? [{ id: 'status', value: statusFilter }] : []);
  }, [statusFilter]);

  const handleStatusFilterChange = useCallback((event) => {
    const value = event.target.value;
    setStatusFilter(value);

    const filters = [];
    if (searchValue) {
      filters.push({ id: searchBy, value: searchValue });
    }
    if (value) {
      filters.push({ id: 'status', value });
    }
    setColumnFilters(filters);
  }, [searchValue, searchBy]);

  const handleTagsFilterChange = useCallback((event, newValue) => {
    setTagsFilter(newValue);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setStatusFilter('');
    setTagsFilter(null);
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || searchValue || statusFilter || tagsFilter,
    [columnFilters, searchValue, statusFilter, tagsFilter]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...mockMerchants];

    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || '';
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    // Filter by tags
    if (tagsFilter) {
      filtered = filtered.filter((item) => item.tags === tagsFilter);
    }

    return filtered;
  }, [columnFilters, tagsFilter]);

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

  const handleView = useCallback((merchant) => {
    setDetailDialog({ open: true, merchant });
  }, []);

  const handleEdit = useCallback((merchant) => {
    router.push(`/admin/utama/data-user/user-merchant/data-user/${merchant.noId}/edit`);
  }, [router]);

  const handleArchive = useCallback((merchant) => {
    setArchiveDialog({ open: true, merchant });
  }, []);

  const handleResetPassword = useCallback((merchant) => {
    setResetPasswordDialog({ open: true, merchant });
  }, []);

  const handleListBank = useCallback((merchant) => {
    router.push(`/admin/utama/data-user/user-merchant/data-user/${merchant.noId}/bank`);
  }, [router]);

  const handleConfirmArchive = useCallback(async () => {
    if (!archiveDialog.merchant) return;
    
    try {
      // TODO: Implement archive API call
      showSuccessToast(`Merchant "${archiveDialog.merchant.nama}" berhasil diarsipkan`);
      setArchiveDialog({ open: false, merchant: null });
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [archiveDialog.merchant]);

  const handleConfirmResetPassword = useCallback(async () => {
    if (!resetPasswordDialog.merchant) return;
    
    try {
      // TODO: Implement reset password API call
      showSuccessToast(`Password merchant "${resetPasswordDialog.merchant.nama}" berhasil direset`);
      setResetPasswordDialog({ open: false, merchant: null });
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [resetPasswordDialog.merchant]);

  const handleAdd = useCallback(() => {
    router.push('/admin/utama/data-user/user-merchant/data-user/new');
  }, [router]);

  const handleUploadData = useCallback(() => {
    setUploadTermsDialogOpen(true);
  }, []);

  const handleDownloadData = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);

  const handleDownloadFormat = useCallback((format) => {
    showSuccessToast(`Data berhasil diunduh dalam format ${format}`);
    // TODO: Implement actual download
  }, []);

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
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'noId',
        header: 'No ID',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'username',
        header: 'Username',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'noTelp',
        header: 'No Telp',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const isAktif = status === 'Aktif';
          return (
            <Chip
              label={status}
              size="small"
              sx={{
                bgcolor: isAktif ? '#d1fae5' : '#fef3c7',
                color: isAktif ? '#065f46' : '#92400e',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                border: 'none',
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
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
      },
    },
    renderRowActions: ({ row }) => (
      <Box display="flex" gap={0.5}>
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
        <Tooltip title="List Bank" arrow>
          <IconButton
            size="small"
            onClick={() => handleListBank(row.original)}
            sx={{
              color: '#10b981',
              '&:hover': {
                bgcolor: 'rgba(16, 185, 129, 0.08)',
              },
            }}
          >
            <Bank size={20} variant="Linear" color="#10b981" />
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
        <Tooltip title="Archive" arrow>
          <IconButton
            size="small"
            onClick={() => handleArchive(row.original)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            <Archive size={20} variant="Linear" color="#d32f2f" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Password" arrow>
          <IconButton
            size="small"
            onClick={() => handleResetPassword(row.original)}
            sx={{
              color: '#1976d2',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <Refresh2 size={20} variant="Linear" color="#1976d2" />
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
    <Box sx={{ width: '100%' }}>
      {/* Table Section */}
      <Box sx={{ width: '100%' }}>
        {/* Toolbar dengan tombol Filter dan Action Buttons */}
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
              alignItems: 'center',
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
            <Button
              variant="contained"
              startIcon={<DocumentUpload size={20} color="white" />}
              onClick={handleUploadData}
              sx={{
                textTransform: 'none',
              }}
            >
              Upload Data Merchant
            </Button>
            <Tooltip title="Unduh Data" arrow>
              <IconButton
                onClick={handleDownloadData}
                sx={{
                  color: '#10b981',
                  border: '1px solid #10b981',
                  bgcolor: '#ecfdf5',
                  '&:hover': {
                    bgcolor: '#d1fae5',
                    borderColor: '#059669',
                  },
                }}
              >
                <DocumentDownload size={20} color="#10b981" />
              </IconButton>
            </Tooltip>
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
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 150 }}>
              <Select
                value={searchBy}
                onChange={handleSearchByChange}
                displayEmpty
                fullWidth
                size="small"
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography sx={{ color: 'text.secondary' }}>Cari Berdasarkan</Typography>;
                  }
                  const labels = {
                    nama: 'Nama',
                    noId: 'No ID',
                    email: 'Email',
                    username: 'Username',
                    noTelp: 'No Telp',
                  };
                  return labels[selected] || selected;
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
                <MenuItem value="nama">Nama</MenuItem>
                <MenuItem value="noId">No ID</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="username">Username</MenuItem>
                <MenuItem value="noTelp">No Telp</MenuItem>
              </Select>
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <TextField
                fullWidth
                placeholder={`Cari ${searchBy === 'nama' ? 'Nama' : searchBy === 'noId' ? 'No ID' : searchBy === 'email' ? 'Email' : searchBy === 'username' ? 'Username' : 'No Telp'}...`}
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
            </Box>
            <Box sx={{ minWidth: 150 }}>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                displayEmpty
                fullWidth
                size="small"
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography sx={{ color: 'text.secondary' }}>Status</Typography>;
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
                <MenuItem value="Aktif">Aktif</MenuItem>
                <MenuItem value="Arsip">Tidak Aktif</MenuItem>
              </Select>
            </Box>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Autocomplete
                options={tagsOptions}
                value={tagsFilter}
                onChange={handleTagsFilterChange}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Pilih Tags"
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
                )}
              />
            </Box>
          </Box>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Detail Dialog */}
      <UserMerchantDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, merchant: null })}
        merchant={detailDialog.merchant}
      />

      {/* Archive Confirmation Dialog */}
      <AlertDialog
        open={archiveDialog.open}
        onClose={() => setArchiveDialog({ open: false, merchant: null })}
        onConfirm={handleConfirmArchive}
        title="Konfirmasi Archive"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan mengarsipkan merchant <strong>{archiveDialog.merchant?.nama}</strong>?
          </Typography>
        }
        confirmText="Ya, Archive"
        cancelText="Batal"
        confirmColor="error"
      />

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog
        open={resetPasswordDialog.open}
        onClose={() => setResetPasswordDialog({ open: false, merchant: null })}
        onConfirm={handleConfirmResetPassword}
        title="Konfirmasi Reset Password"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan mereset password merchant <strong>{resetPasswordDialog.merchant?.nama}</strong>?
          </Typography>
        }
        confirmText="Ya, Reset"
        cancelText="Batal"
        confirmColor="primary"
      />

      {/* Upload Data Terms Dialog */}
      <UploadDataTermsDialog
        open={uploadTermsDialogOpen}
        onClose={() => setUploadTermsDialogOpen(false)}
        onStartUpload={() => {
          setUploadTermsDialogOpen(false);
          setUploadDataDialogOpen(true);
        }}
      />

      {/* Upload Data Dialog */}
      <UploadDataDialog
        open={uploadDataDialogOpen}
        onClose={() => setUploadDataDialogOpen(false)}
        onShowTerms={() => {
          setUploadDataDialogOpen(false);
          setUploadTermsDialogOpen(true);
        }}
      />

      {/* Download Data Dialog */}
      <DownloadDataDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        onDownload={handleDownloadFormat}
      />
    </Box>
  );
}
