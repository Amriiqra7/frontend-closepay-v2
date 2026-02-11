'use client';

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
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
    });
  }

  return companies;
};

const mockCompanies = generateMockCompanies();

export default function Company() {
  const router = useRouter();
  const pathname = usePathname();
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(mockCompanies.length);
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
    // TODO: Implement view functionality
    console.log('View company:', company);
  }, []);

  const handleEdit = useCallback((company) => {
    // TODO: Implement edit functionality
    console.log('Edit company:', company);
    // router.push(`${pathname}/${company.id}/edit`);
  }, []);

  const handleDelete = useCallback((company) => {
    setDeleteDialog({
      open: true,
      id: company.id,
      name: company.nama,
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    // TODO: Implement delete functionality
    console.log('Delete company:', deleteDialog.id);
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
        </FilterCollapse>

        {/* MaterialReactTable */}
        <MaterialReactTable table={table} />
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
