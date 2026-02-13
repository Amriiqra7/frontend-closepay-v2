'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, MoreCircle } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import UserMemberConfigDetailDialog from './UserMemberConfigDetailDialog';

// Mock data untuk Basic Data
const basicData = [
  {
    id: 1,
    namaKolom: 'Nama Lengkap',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Ya',
    dapatDiedit: 'Ya',
  },
  {
    id: 2,
    namaKolom: 'Bahasa',
    statusKolom: 'Tidak Ditampilkan',
    wajibDiisi: 'Tidak',
    dapatDiedit: 'Ya',
  },
  {
    id: 3,
    namaKolom: 'Nomor Telepon',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Ya',
    dapatDiedit: 'Tidak',
  },
  {
    id: 4,
    namaKolom: 'Alamat',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Ya',
    dapatDiedit: 'Ya',
  },
  {
    id: 5,
    namaKolom: 'Tanggal Lahir',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Ya',
    dapatDiedit: 'Ya',
  },
  {
    id: 6,
    namaKolom: 'Tempat Lahir',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Tidak',
    dapatDiedit: 'Ya',
  },
  {
    id: 7,
    namaKolom: 'Jenis Kelamin',
    statusKolom: 'Tidak Ditampilkan',
    wajibDiisi: 'Tidak',
    dapatDiedit: 'Ya',
  },
];

// Mock data untuk Data Tambahan
const dataTambahan = [
  {
    id: 1,
    namaKolom: 'Hobi',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Tidak',
    dapatDiedit: 'Ya',
  },
  {
    id: 2,
    namaKolom: 'Pendidikan Terakhir',
    statusKolom: 'Ditampilkan',
    wajibDiisi: 'Ya',
    dapatDiedit: 'Ya',
  },
  {
    id: 3,
    namaKolom: 'Pekerjaan',
    statusKolom: 'Tidak Ditampilkan',
    wajibDiisi: 'Tidak',
    dapatDiedit: 'Ya',
  },
];

export default function UserMemberConfigList() {
  const router = useRouter();
  const [sortingBasic, setSortingBasic] = useState([]);
  const [sortingTambahan, setSortingTambahan] = useState([]);
  const [detailDialog, setDetailDialog] = useState({ open: false, data: null, isDataTambahan: false });

  // Sort data Basic
  const sortedBasicData = useMemo(() => {
    if (sortingBasic.length === 0) return basicData;

    const sorted = [...basicData];
    const sort = sortingBasic[0];
    sorted.sort((a, b) => {
      const aVal = a[sort.id] || '';
      const bVal = b[sort.id] || '';
      if (sort.desc) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    return sorted;
  }, [sortingBasic]);

  // Sort data Tambahan
  const sortedTambahanData = useMemo(() => {
    if (sortingTambahan.length === 0) return dataTambahan;

    const sorted = [...dataTambahan];
    const sort = sortingTambahan[0];
    sorted.sort((a, b) => {
      const aVal = a[sort.id] || '';
      const bVal = b[sort.id] || '';
      if (sort.desc) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    return sorted;
  }, [sortingTambahan]);

  const handleAdd = useCallback(() => {
    router.push('/admin/utama/data-user/user-member/konfig-user-member/new');
  }, [router]);

  const handleDetail = useCallback((row, isDataTambahan = false) => {
    setDetailDialog({ open: true, data: row, isDataTambahan });
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'namaKolom',
        header: 'Nama Kolom',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'statusKolom',
        header: 'Status Kolom',
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const isDitampilkan = status === 'Ditampilkan';
          return (
            <Chip
              label={status}
              size="small"
              sx={{
                bgcolor: isDitampilkan ? '#d1fae5' : '#fee2e2',
                color: isDitampilkan ? '#065f46' : '#991b1b',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                border: 'none',
              }}
            />
          );
        },
      },
      {
        accessorKey: 'wajibDiisi',
        header: 'Wajib Diisi',
        size: 120,
        Cell: ({ cell }) => {
          const wajib = cell.getValue();
          const isYa = wajib === 'Ya';
          return (
            <Chip
              label={wajib}
              size="small"
              sx={{
                bgcolor: isYa ? '#dbeafe' : '#f3f4f6',
                color: isYa ? '#1e40af' : '#6b7280',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                border: 'none',
              }}
            />
          );
        },
      },
      {
        accessorKey: 'dapatDiedit',
        header: 'Dapat Diedit',
        size: 120,
        Cell: ({ cell }) => {
          const dapat = cell.getValue();
          const isYa = dapat === 'Ya';
          return (
            <Chip
              label={dapat}
              size="small"
              sx={{
                bgcolor: isYa ? '#dbeafe' : '#f3f4f6',
                color: isYa ? '#1e40af' : '#6b7280',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                border: 'none',
              }}
            />
          );
        },
      },
      {
        id: 'aksi',
        header: 'Aksi',
        size: 80,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => {
          // Determine if this is from data tambahan table by checking if formatKolom exists
          const isDataTambahan = row.original.hasOwnProperty('formatKolom');
          return (
            <Tooltip title="Detail" arrow>
              <IconButton
                size="small"
                onClick={() => handleDetail(row.original, isDataTambahan)}
                sx={{
                  color: '#1976d2',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <MoreCircle size={20} variant="Linear" color="#1976d2" />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    [handleDetail]
  );

  const tableBasic = useMaterialReactTable({
    columns,
    data: sortedBasicData,
    getRowId: (row) => row.id.toString(),
    state: {
      isLoading: false,
      sorting: sortingBasic,
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
    enableHiding: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    manualSorting: true,
    onSortingChange: setSortingBasic,
    muiTableHeadCellProps: {
      sx: {
        fontSize: '12px !important',
        fontWeight: 600,
        color: '#374151',
        backgroundColor: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
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
  });

  const tableTambahan = useMaterialReactTable({
    columns,
    data: sortedTambahanData,
    getRowId: (row) => row.id.toString(),
    state: {
      isLoading: false,
      sorting: sortingTambahan,
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
    enableHiding: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    manualSorting: true,
    onSortingChange: setSortingTambahan,
    muiTableHeadCellProps: {
      sx: {
        fontSize: '12px !important',
        fontWeight: 600,
        color: '#374151',
        backgroundColor: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
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
  });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Description */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
          Konfigurasi ini akan diterapkan pada formulir data saat melakukan penambahan user member, upload/unggah member, dan registrasi mandiri. Anda dapat menambahkan dan mengatur data lain yang dibutuhkan.
        </Typography>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          p: 2,
          pt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(232, 235, 238, 1)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
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
          Atur Data Member
        </Button>
      </Box>

      {/* Basic Data Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: '#111827' }}>
          Basic Data
        </Typography>
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={tableBasic} />
        </Box>
      </Box>

      {/* Data Tambahan Table */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: '#111827' }}>
          Data Tambahan
        </Typography>
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={tableTambahan} />
        </Box>
      </Box>

      {/* Detail Dialog */}
      <UserMemberConfigDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, data: null, isDataTambahan: false })}
        data={detailDialog.data}
        isDataTambahan={detailDialog.isDataTambahan}
      />
    </Box>
  );
}
