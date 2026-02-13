'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Edit, InfoCircle } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { showSuccessToast } from '@/shared/utils/toast';
import AddDataTambahanDialog from './AddDataTambahanDialog';

// Mock data untuk Basic Data
const basicData = [
  {
    id: 1,
    namaKolom: 'Nama Lengkap',
    statusKolom: true,
    wajibDiisi: true,
    dapatDiedit: true,
  },
  {
    id: 2,
    namaKolom: 'Bahasa',
    statusKolom: false,
    wajibDiisi: false,
    dapatDiedit: true,
  },
  {
    id: 3,
    namaKolom: 'Nomor Telepon',
    statusKolom: true,
    wajibDiisi: true,
    dapatDiedit: false,
  },
  {
    id: 4,
    namaKolom: 'Alamat',
    statusKolom: true,
    wajibDiisi: true,
    dapatDiedit: true,
  },
  {
    id: 5,
    namaKolom: 'Tanggal Lahir',
    statusKolom: true,
    wajibDiisi: true,
    dapatDiedit: true,
  },
  {
    id: 6,
    namaKolom: 'Tempat Lahir',
    statusKolom: true,
    wajibDiisi: false,
    dapatDiedit: true,
  },
  {
    id: 7,
    namaKolom: 'Jenis Kelamin',
    statusKolom: false,
    wajibDiisi: false,
    dapatDiedit: true,
  },
  {
    id: 8,
    namaKolom: 'Username',
    statusKolom: true,
    wajibDiisi: true,
    dapatDiedit: true,
  },
  {
    id: 9,
    namaKolom: 'Jenis Identitas',
    statusKolom: false,
    wajibDiisi: false,
    dapatDiedit: true,
  },
  {
    id: 10,
    namaKolom: 'Nomor Identitas',
    statusKolom: true,
    wajibDiisi: false,
    dapatDiedit: true,
  },
];

// Mock data untuk Data Tambahan
const initialDataTambahan = [
  {
    id: 1,
    namaKolom: 'Hobi',
    formatKolom: 'Text',
    statusKolom: true,
    wajibDiisi: false,
    dapatDiedit: true,
  },
  {
    id: 2,
    namaKolom: 'Pendidikan Terakhir',
    formatKolom: 'Enum',
    statusKolom: true,
    wajibDiisi: true,
    dapatDiedit: true,
  },
  {
    id: 3,
    namaKolom: 'Pekerjaan',
    formatKolom: 'Text',
    statusKolom: false,
    wajibDiisi: false,
    dapatDiedit: true,
  },
];

export default function UserMemberConfigNew() {
  const router = useRouter();
  const [sortingBasic, setSortingBasic] = useState([]);
  const [sortingTambahan, setSortingTambahan] = useState([]);
  const [basicDataState, setBasicDataState] = useState(basicData);
  const [dataTambahan, setDataTambahan] = useState(initialDataTambahan);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Sort data Basic
  const sortedBasicData = useMemo(() => {
    if (sortingBasic.length === 0) return basicDataState;

    const sorted = [...basicDataState];
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
  }, [sortingBasic, basicDataState]);

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
  }, [sortingTambahan, dataTambahan]);

  const handleBasicCheckboxChange = useCallback((id, field) => {
    setBasicDataState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  }, []);

  const handleTambahanCheckboxChange = useCallback((id, field) => {
    setDataTambahan((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  }, []);

  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setAddDialogOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditingItem(row.original);
    setEditDialogOpen(true);
  }, []);

  const handleSaveDataTambahan = useCallback((data) => {
    if (editingItem) {
      setDataTambahan((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...data } : item))
      );
      setEditDialogOpen(false);
      showSuccessToast('Data tambahan berhasil diupdate');
    } else {
      const newId = Math.max(...dataTambahan.map((item) => item.id), 0) + 1;
      setDataTambahan((prev) => [...prev, { ...data, id: newId }]);
      setAddDialogOpen(false);
      showSuccessToast('Data tambahan berhasil ditambahkan');
    }
    setEditingItem(null);
  }, [editingItem, dataTambahan]);

  const columnsBasic = useMemo(
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
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.statusKolom}
            onChange={(e) => {
              e.stopPropagation();
              handleBasicCheckboxChange(row.original.id, 'statusKolom');
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              color: '#1976d2',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        ),
      },
      {
        accessorKey: 'wajibDiisi',
        header: 'Wajib Diisi',
        size: 120,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.wajibDiisi}
            onChange={(e) => {
              e.stopPropagation();
              handleBasicCheckboxChange(row.original.id, 'wajibDiisi');
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              color: '#1976d2',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        ),
      },
      {
        accessorKey: 'dapatDiedit',
        header: 'Dapat Diedit',
        size: 120,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.dapatDiedit}
            onChange={(e) => {
              e.stopPropagation();
              handleBasicCheckboxChange(row.original.id, 'dapatDiedit');
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              color: '#1976d2',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        ),
      },
    ],
    [handleBasicCheckboxChange]
  );

  const columnsTambahan = useMemo(
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
        accessorKey: 'formatKolom',
        header: 'Format Kolom',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'statusKolom',
        header: 'Status Kolom',
        size: 150,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.statusKolom}
            onChange={(e) => {
              e.stopPropagation();
              handleTambahanCheckboxChange(row.original.id, 'statusKolom');
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              color: '#1976d2',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        ),
      },
      {
        accessorKey: 'wajibDiisi',
        header: 'Wajib Diisi',
        size: 120,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.wajibDiisi}
            onChange={(e) => {
              e.stopPropagation();
              handleTambahanCheckboxChange(row.original.id, 'wajibDiisi');
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              color: '#1976d2',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        ),
      },
      {
        accessorKey: 'dapatDiedit',
        header: 'Dapat Diedit',
        size: 120,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.dapatDiedit}
            onChange={(e) => {
              e.stopPropagation();
              handleTambahanCheckboxChange(row.original.id, 'dapatDiedit');
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              color: '#1976d2',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        ),
      },
      {
        id: 'aksi',
        header: 'Aksi',
        size: 80,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Edit" arrow>
            <IconButton
              size="small"
              onClick={() => handleEdit(row)}
              sx={{
                color: '#1976d2',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <Edit size={20} variant="Linear" color="#1976d2" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [handleTambahanCheckboxChange, handleEdit]
  );

  const tableBasic = useMaterialReactTable({
    columns: columnsBasic,
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
    columns: columnsTambahan,
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
          Atur dan tambahkan kolom sesuai kebutuhan Anda.
        </Typography>
      </Box>

      {/* Basic Data Table */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
            Basic Data
          </Typography>
          <Tooltip
            title="Anda dapat mengatur data yang ada untuk diterapkan ke member anda"
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <InfoCircle size={20} variant="Linear" color="#6b7280" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ pb: 5 }} key={`table-basic-${JSON.stringify(basicDataState)}`}>
          <MaterialReactTable table={tableBasic} />
        </Box>
      </Box>

      {/* Data Tambahan Table */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              Data Tambahan
            </Typography>
            <Tooltip
              title="Anda Dapat menambahkan data tambahan lainnya yang tidak tersedia pada Basic Data untuk diterapkan pada member anda sesuai dengan kebutuhan anda"
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ p: 0.5 }}>
                <InfoCircle size={20} variant="Linear" color="#6b7280" />
              </IconButton>
            </Tooltip>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add size={20} color="white" />}
            onClick={handleAdd}
            sx={{
              textTransform: 'none',
            }}
          >
            Tambah Data Tambahan
          </Button>
        </Box>
        <Box sx={{ pb: 5 }} key={`table-tambahan-${JSON.stringify(dataTambahan)}`}>
          <MaterialReactTable table={tableTambahan} />
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 4,
          py: 3,
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <Button
          variant="outlined"
          onClick={() => router.push('/admin/utama/data-user/user-member/konfig-user-member')}
          sx={{
            textTransform: 'none',
            borderColor: '#dc2626',
            color: '#dc2626',
            '&:hover': {
              borderColor: '#b91c1c',
              bgcolor: '#fef2f2',
            },
          }}
        >
          Batal
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            showSuccessToast('Perubahan berhasil disimpan');
            router.push('/admin/utama/data-user/user-member/konfig-user-member');
          }}
          sx={{
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          Simpan Perubahan
        </Button>
      </Box>

      {/* Dialogs */}
      <AddDataTambahanDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveDataTambahan}
      />
      <AddDataTambahanDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveDataTambahan}
        initialData={editingItem}
        isEdit={true}
      />
    </Box>
  );
}
