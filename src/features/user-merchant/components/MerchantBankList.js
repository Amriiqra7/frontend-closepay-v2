'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Edit, Trash } from 'iconsax-react';
import TablePagination from '@/shared/ui/TablePagination';
import { handleDeleteWithToast } from '@/shared/utils/toast';
import MerchantBankFormDialog from './MerchantBankFormDialog';
import AlertDialog from '@/shared/ui/AlertDialog';

// Mock data - replace with actual API call
const generateMockBanks = (merchantId) => {
  return [
    {
      id: 1,
      noRekening: '123123123',
      namaRekening: 'Ilkam',
      namaBank: 'BNI',
      merchantId: merchantId,
    },
    {
      id: 2,
      noRekening: '456456456',
      namaRekening: 'Rekening Utama',
      namaBank: 'BCA',
      merchantId: merchantId,
    },
    {
      id: 3,
      noRekening: '789789789',
      namaRekening: 'Rekening Sekunder',
      namaBank: 'Mandiri',
      merchantId: merchantId,
    },
  ];
};

// Mock bank options
const bankOptions = [
  { value: 'BNI', label: 'BNI' },
  { value: 'BCA', label: 'BCA' },
  { value: 'Mandiri', label: 'Mandiri' },
  { value: 'BRI', label: 'BRI' },
  { value: 'CIMB', label: 'CIMB' },
  { value: 'Danamon', label: 'Danamon' },
];

export default function MerchantBankList() {
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.id;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', bank: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bank: null });

  // Mock data - replace with actual API call
  const mockBanks = useMemo(() => {
    return generateMockBanks(merchantId);
  }, [merchantId]);

  const sortedData = useMemo(() => {
    let sorted = [...mockBanks];
    
    if (sorting.length > 0) {
      const sort = sorting[0];
      sorted.sort((a, b) => {
        const aValue = a[sort.id];
        const bValue = b[sort.id];
        if (aValue < bValue) return sort.desc ? 1 : -1;
        if (aValue > bValue) return sort.desc ? -1 : 1;
        return 0;
      });
    }

    return sorted;
  }, [mockBanks, sorting]);

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
    }));
  }, [sortedData, pagination]);

  const handleAdd = useCallback(() => {
    setFormDialog({ open: true, mode: 'add', bank: null });
  }, []);

  const handleEdit = useCallback((bank) => {
    setFormDialog({ open: true, mode: 'edit', bank });
  }, []);

  const handleDelete = useCallback((bank) => {
    setDeleteDialog({ open: true, bank });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.bank) return;
    
    try {
      // TODO: Implement delete API call
      const deletePromise = new Promise((resolve) => {
        setTimeout(() => {
          console.log('Deleting bank:', deleteDialog.bank.id);
          resolve({ success: true });
        }, 1000);
      });
      
      await handleDeleteWithToast(
        deletePromise,
        'bank merchant',
        deleteDialog.bank.namaRekening
      );
      setDeleteDialog({ open: false, bank: null });
      // TODO: Refresh data
    } catch (error) {
      // Error already handled by toast
    }
  }, [deleteDialog.bank]);

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
        Cell: ({ row }) => {
          const pageIndex = pagination.pageIndex;
          const pageSize = pagination.pageSize;
          return pageIndex * pageSize + row.index + 1;
        },
      },
      {
        accessorKey: 'noRekening',
        header: 'No Rekening',
        size: 200,
      },
      {
        accessorKey: 'namaRekening',
        header: 'Nama Rekening',
        size: 250,
      },
      {
        accessorKey: 'namaBank',
        header: 'Nama Bank',
        size: 200,
      },
      {
        id: 'actions',
        header: 'Aksi',
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit" arrow>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEdit(row.original)}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  '&:hover': {
                    borderColor: '#d97706',
                    bgcolor: '#fef3c7',
                  },
                }}
              >
                <Edit size={18} color="#f59e0b" />
              </Button>
            </Tooltip>
            <Tooltip title="Hapus" arrow>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleDelete(row.original)}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  borderColor: '#dc2626',
                  color: '#dc2626',
                  '&:hover': {
                    borderColor: '#b91c1c',
                    bgcolor: '#fee2e2',
                  },
                }}
              >
                <Trash size={18} color="#dc2626" />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [pagination, handleEdit, handleDelete]
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
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    muiTableHeadCellProps: {
      sx: {
        fontSize: '12px !important',
        fontWeight: 600,
        color: '#374151',
        backgroundColor: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
        paddingLeft: '16px !important',
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
      sx: { 
        fontSize: '12px !important',
        paddingLeft: '16px !important',
      },
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
          Tambah
        </Button>
      </Box>

      {/* MaterialReactTable */}
      <Box sx={{ pb: 5 }}>
        <MaterialReactTable table={table} />
      </Box>

      {/* Form Dialog */}
      <MerchantBankFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'add', bank: null })}
        mode={formDialog.mode}
        bank={formDialog.bank}
        bankOptions={bankOptions}
        merchantId={merchantId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, bank: null })}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus bank <strong>{deleteDialog.bank?.namaRekening}</strong>?
          </Typography>
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Box>
  );
}
