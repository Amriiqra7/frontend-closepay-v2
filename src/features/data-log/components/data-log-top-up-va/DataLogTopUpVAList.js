'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Eye } from 'iconsax-react';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import DataLogTopUpVADetailDialog from './DataLogTopUpVADetailDialog';
import dayjs from 'dayjs';

// Mock data untuk bank
const mockBanks = [
  { id: '1', name: 'BSI TBG' },
  { id: '2', name: 'BCA' },
  { id: '3', name: 'BNI' },
  { id: '4', name: 'Mandiri' },
  { id: '5', name: 'BRI' },
];

// Mock data untuk company
const mockCompanies = [
  { id: '1', name: 'PT Company A' },
  { id: '2', name: 'PT Company B' },
  { id: '3', name: 'PT Company C' },
  { id: '4', name: 'PT Company D' },
];

// Mock data untuk Data Log Top Up VA
const generateMockLogs = () => {
  const logs = [];
  const events = ['VA DEBIT CREDIT GET BALANCE', 'VA DEBIT CREDIT', 'VA TOP UP'];
  const statuses = ['Berhasil', 'Gagal'];

  for (let i = 1; i <= 50; i++) {
    const date = new Date(2026, 1, 20 - Math.floor(i / 2), 13, 44 + (i % 20), 19 + (i % 40));

    logs.push({
      id: `699802c36a07d84a747b408${i}`,
      tanggal: date,
      idTransaksi: `699802c36a07d84a747b408${i}`,
      event: events[i % events.length],
      status: i % 3 === 0 ? 'Gagal' : 'Berhasil',
      responseDetail: {
        id: `699802c36a07d84a747b408${i}`,
        companyId: '6344ee8e91d97e8214cd5f25',
        request: {
          companyId: '6344ee8e91d97e8214cd5f25',
          userId: '645318d128e774db3439b066',
        },
        error: i % 3 === 0 ? {
          status_code: '400',
          error: 'BAD REQUEST',
          timestamp: dayjs(date).add(1, 'second').format('YYYY-MM-DD HH:mm:ss'),
          path: '',
          params: '',
          type: 'FAILED_GET_BALANCE',
          message: `Account not found [Code: da22b${i}]`,
          data: '',
          paging: '',
        } : null,
        event: events[i % events.length],
        clientResponse: {
          response_code: i % 3 === 0 ? '0001' : '0000',
          message: i % 3 === 0 ? 'Failed' : 'Success',
        },
      },
    });
  }

  return logs;
};

const mockLogs = generateMockLogs();

export default function DataLogTopUpVAList() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedCompany(null);
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => selectedCompany !== null,
    [selectedCompany]
  );

  // Filter data berdasarkan bank dan company
  const filteredData = useMemo(() => {
    if (!selectedBank) return [];

    let filtered = [...mockLogs];

    if (selectedCompany) {
      // Filter by company (mock - in real app, this would filter by companyId)
      filtered = filtered.filter((item, index) => index % mockCompanies.length === mockCompanies.findIndex(c => c.id === selectedCompany.id));
    }

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
  }, [selectedBank, selectedCompany, columnFilters]);

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

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  const handleOpenDetailDialog = useCallback((log) => {
    setSelectedLog(log);
    setOpenDetailDialog(true);
  }, []);

  const handleCloseDetailDialog = useCallback(() => {
    setOpenDetailDialog(false);
    setSelectedLog(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'No',
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
        accessorKey: 'tanggal',
        header: 'Tanggal',
        size: 180,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            {dayjs(cell.getValue()).format('YYYY-MM-DD HH:mm:ss')}
          </Typography>
        ),
      },
      {
        accessorKey: 'idTransaksi',
        header: 'ID Transaksi',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'event',
        header: 'Event',
        size: 250,
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
        enableSorting: false,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const isGagal = status === 'Gagal';
          return (
            <Chip
              label={status}
              size="small"
              sx={{
                bgcolor: isGagal ? '#fee2e2' : '#d1fae5',
                color: isGagal ? '#991b1b' : '#065f46',
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
    positionActionsColumn: 'last',
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
    manualFiltering: true,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
        size: 80,
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-start' }}>
        <Tooltip title="Detail">
          <IconButton
            size="small"
            onClick={() => handleOpenDetailDialog(row.original)}
            sx={{ color: '#155DFC' }}
          >
            <Eye size={20} color="#155DFC" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Bank Selector */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(232, 235, 238, 1)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Autocomplete
            options={mockBanks}
            getOptionLabel={(option) => option.name}
            value={selectedBank}
            onChange={(event, newValue) => setSelectedBank(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Silahkan Pilih"
                size="small"
                sx={{
                  minWidth: 300,
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
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            * Pilih bank untuk menampilkan data log
          </Typography>
        </Box>

        {/* Filter Section */}
        {selectedBank && (
          <>
            {/* Toolbar dengan tombol Filter */}
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Autocomplete
                  options={mockCompanies}
                  getOptionLabel={(option) => option.name}
                  value={selectedCompany}
                  onChange={(event, newValue) => setSelectedCompany(newValue)}
                  sx={{ minWidth: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Pilih Company"
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
                  )}
                />
              </Box>
            </FilterCollapse>
          </>
        )}
      </Box>

      {/* MaterialReactTable */}
      {selectedBank && (
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={table} />
        </Box>
      )}

      {/* Detail Dialog */}
      <DataLogTopUpVADetailDialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        log={selectedLog}
      />
    </Box>
  );
}
