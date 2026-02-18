'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Edit, Trash, Add } from 'iconsax-react';
import { handleDeleteWithToast, handleCreateWithToast, handleUpdateWithToast } from '@/shared/utils/toast';
import MasterBankDialog from './MasterBankDialog';
import AlertDialog from '@/shared/ui/AlertDialog';
import TablePagination from '@/shared/ui/TablePagination';

// Mock data - replace with actual API call
const mockMasterBankData = [
  {
    id: 1,
    namaBank: 'Bank Mandiri',
    kodeBank: 'BMRI',
  },
  {
    id: 2,
    namaBank: 'Bank BCA',
    kodeBank: 'BBCA',
  },
  {
    id: 3,
    namaBank: 'Bank BRI',
    kodeBank: 'BBRI',
  },
];

export default function MasterBankList() {
  const [masterBankList, setMasterBankList] = useState(mockMasterBankData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return masterBankList;

    const sorted = [...masterBankList];
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
  }, [masterBankList, sorting]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [sortedData, pagination]);

  const handleTambah = () => {
    setSelectedBank(null);
    setDialogOpen(true);
  };

  const handleEdit = (bank) => {
    setSelectedBank(bank);
    setDialogOpen(true);
  };

  const handleDelete = (bank) => {
    setDeleteDialog({
      open: true,
      id: bank.id,
      name: bank.namaBank,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Deleting master bank:', deleteDialog.id);
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Master Bank',
        deleteDialog.name
      );

      setMasterBankList((prev) =>
        prev.filter((item) => item.id !== deleteDialog.id)
      );
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBank(null);
  };

  const handleSave = async (data) => {
    try {
      const savePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Saving master bank:', data);
          if (Math.random() > 0.1) {
            resolve({ success: true, data });
          } else {
            reject(new Error('Gagal menyimpan data'));
          }
        }, 1000);
      });

      if (selectedBank) {
        // Update existing
        await handleUpdateWithToast(savePromise, 'master bank');
        setMasterBankList((prev) =>
          prev.map((item) =>
            item.id === selectedBank.id ? { ...data, id: selectedBank.id } : item
          )
        );
      } else {
        // Add new
        await handleCreateWithToast(savePromise, 'master bank');
        const newId = Math.max(...masterBankList.map((item) => item.id), 0) + 1;
        setMasterBankList((prev) => [...prev, { ...data, id: newId }]);
      }

      handleCloseDialog();
    } catch (err) {
      // Error already handled by toast
    }
  };

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
        accessorKey: 'namaBank',
        header: 'Nama Bank',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'kodeBank',
        header: 'Kode Bank',
        size: 150,
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
    autoResetPageIndex: false,
    positionActionsColumn: 'last',
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
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
        muiTableHeadCellProps: { align: 'left' },
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        display="flex"
        gap={0.5}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
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
        {/* Toolbar dengan tombol Tambah */}
        <Box
          sx={{
            p: 2,
            pt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add size={20} color="white" />}
            onClick={handleTambah}
            sx={{
              textTransform: 'none',
            }}
          >
            Tambah
          </Button>
        </Box>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 4 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Dialog Form */}
      <MasterBankDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        data={selectedBank}
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
