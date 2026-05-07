'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Switch,
  Chip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Eye, Edit } from 'iconsax-react';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import { showSuccessToast } from '@/shared/utils/toast';
import TagDetailDialog from './TagDetailDialog';
import TagFormDialog from './TagFormDialog';

// Mock data
const generateMockTags = () => {
  const tags = [];
  for (let i = 1; i <= 20; i++) {
    tags.push({
      id: i,
      nama: `Tag ${i}`,
      sinkronkan: i % 3 === 0,
    });
  }
  return tags;
};

const mockTags = generateMockTags();

export default function TagsList() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [detailDialog, setDetailDialog] = useState({ open: false, tag: null });
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', tag: null });

  const filteredData = useMemo(() => {
    let filtered = [...mockTags];

    if (searchValue) {
      filtered = filtered.filter((tag) =>
        tag.nama.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filtered;
  }, [searchValue]);

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
        header: 'Nama Tags',
        size: 300,
      },
      {
        accessorKey: 'sinkronkan',
        header: 'Sinkronkan Tags ke Self Register',
        size: 250,
        Cell: ({ row }) => (
          <Chip
            label={row.original.sinkronkan ? 'Ya' : 'Tidak'}
            color={row.original.sinkronkan ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Aksi',
        size: 100,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Detail" arrow>
              <IconButton
                size="small"
                onClick={() => setDetailDialog({ open: true, tag: row.original })}
                sx={{
                  color: '#3b82f6',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                  },
                }}
              >
                <Eye size={20} variant="Linear" color="#3b82f6" />
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

  const hasActiveFilters = Boolean(searchValue);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleAdd = useCallback(() => {
    setFormDialog({ open: true, mode: 'add', tag: null });
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Table Section */}
      <Box sx={{ width: '100%' }}>
        {/* Deskripsi */}
        <Box
          sx={{
            p: 2,
            pb: 1.5,
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(232, 235, 238, 1)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}
          >
            Daftar tags pada tabel dibawah adalah tags-tags yang akan muncul saat ini ingin menambahkan tags ke member instansi Anda. Untuk tags yang ingin Anda atur pada self register (pendaftaran member mandiri), Anda harus mengaktifkan pengaturan sinkronisasi tags ke self register.
          </Typography>
        </Box>

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
              }}
            >
              Tambah
            </Button>
          </Box>
        </Box>

        {/* FilterCollapse */}
        <FilterCollapse open={showFilters} hideHeader grid={false}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Cari Nama"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Cari berdasarkan nama tags"
            />
          </Box>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Detail Dialog */}
      <TagDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, tag: null })}
        tag={detailDialog.tag}
      />

      {/* Form Dialog */}
      <TagFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'add', tag: null })}
        mode={formDialog.mode}
        tag={formDialog.tag}
        onSuccess={() => {
          setFormDialog({ open: false, mode: 'add', tag: null });
          showSuccessToast('Tag berhasil ditambahkan');
          // TODO: Refresh data
        }}
      />
    </Box>
  );
}
