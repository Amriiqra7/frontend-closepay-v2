'use client';

import React, { useMemo, useState, useCallback } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Add, Eye, CloseCircle } from 'iconsax-react';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import ParentMemberLogDetailDialog from './ParentMemberLogDetailDialog';

// Mock data
const generateMockLogs = () => {
  const logs = [];
  const modes = [
    'Menghubungkan akun induk',
    'Melepas Akun Induk',
    'Mengganti akun induk',
    'Mengatur Ulang Password',
    'Perbarui Detail',
  ];
  const members = ['Yeni Fams', 'keluargaaaa', 'Bontot family', 'yeyenfamilyyy'];
  const users = ['Nama Saya', 'Superadmin', 'Admin'];

  for (let i = 1; i <= 20; i++) {
    logs.push({
      id: i,
      tanggal: new Date(2026, 1, 10, 10, 9, 35 - i),
      diperbaruiOleh: users[i % users.length],
      namaAkunInduk: members[i % members.length],
      mode: modes[i % modes.length],
      jenisUser: users[i % users.length],
    });
  }

  return logs;
};

const mockLogs = generateMockLogs();

const availableFilters = [
  { value: 'tanggal', label: 'Tanggal', type: 'date', default: true },
  { value: 'jenisUser', label: 'Jenis User', type: 'select' },
  { value: 'cariMember', label: 'Cari Member', type: 'autocomplete' },
  { value: 'mode', label: 'Mode', type: 'select' },
];

const jenisUserOptions = ['Superadmin', 'Admin'];

const modeOptions = [
  'Menghubungkan akun induk',
  'Melepas Akun Induk',
  'Mengganti akun induk',
  'Mengatur Ulang Password',
  'Perbarui Detail',
];

export default function ParentMemberLogList() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['tanggal']); // Default filter tanggal
  const [filterValues, setFilterValues] = useState({ tanggal: null });
  const [detailDialog, setDetailDialog] = useState({ open: false, log: null });
  const [memberOptions, setMemberOptions] = useState([]);

  // Get unique member names for autocomplete
  React.useEffect(() => {
    const uniqueMembers = [...new Set(mockLogs.map((log) => log.namaAkunInduk))];
    setMemberOptions(uniqueMembers);
  }, []);

  const filteredData = useMemo(() => {
    let filtered = [...mockLogs];

    activeFilters.forEach((filterKey) => {
      const value = filterValues[filterKey];
      if (value) {
        if (filterKey === 'tanggal') {
          // Filter by date
          const filterDate = dayjs(value).startOf('day');
          filtered = filtered.filter((log) => {
            const logDate = dayjs(log.tanggal).startOf('day');
            return logDate.isSame(filterDate);
          });
        } else if (filterKey === 'jenisUser') {
          filtered = filtered.filter((log) => log.jenisUser === value);
        } else if (filterKey === 'cariMember') {
          filtered = filtered.filter((log) =>
            log.namaAkunInduk.toLowerCase().includes(String(value).toLowerCase())
          );
        } else if (filterKey === 'mode') {
          filtered = filtered.filter((log) => log.mode === value);
        } else {
          // Default text filter
          filtered = filtered.filter((log) => {
            const logValue = String(log[filterKey] || '').toLowerCase();
            return logValue.includes(String(value).toLowerCase());
          });
        }
      }
    });

    return filtered;
  }, [activeFilters, filterValues]);

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
        accessorKey: 'tanggal',
        header: 'Tanggal',
        size: 200,
        Cell: ({ row }) => {
          const date = row.original.tanggal;
          return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        },
      },
      {
        accessorKey: 'diperbaruiOleh',
        header: 'Diperbarui Oleh',
        size: 150,
      },
      {
        accessorKey: 'namaAkunInduk',
        header: 'Nama Akun Induk',
        size: 200,
      },
      {
        accessorKey: 'mode',
        header: 'Mode',
        size: 200,
        Cell: ({ row }) => (
          <Chip
            label={row.original.mode}
            color="warning"
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
                onClick={() => setDetailDialog({ open: true, log: row.original })}
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

  const hasActiveFilters = activeFilters.length > 0;

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleResetFilter = useCallback(() => {
    setActiveFilters(['tanggal']); // Reset to default filter
    setFilterValues({ tanggal: null });
  }, []);

  const handleAddFilter = useCallback(() => {
    // Find first available filter that's not already active
    const available = availableFilters.find((f) => !activeFilters.includes(f.value));
    if (available) {
      setActiveFilters([...activeFilters, available.value]);
      setFilterValues({ ...filterValues, [available.value]: '' });
    }
  }, [activeFilters, filterValues]);

  const handleRemoveFilter = useCallback((filterKey) => {
    setActiveFilters(activeFilters.filter((f) => f !== filterKey));
    const newFilterValues = { ...filterValues };
    delete newFilterValues[filterKey];
    setFilterValues(newFilterValues);
  }, [activeFilters, filterValues]);

  const handleFilterValueChange = useCallback((filterKey, value) => {
    setFilterValues({ ...filterValues, [filterKey]: value });
  }, [filterValues]);

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
        </Box>

        {/* FilterCollapse */}
        <FilterCollapse open={showFilters} hideHeader grid={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeFilters.map((filterKey) => {
                const filter = availableFilters.find((f) => f.value === filterKey);
                const isDefault = filter?.default;
                const isDisabled = isDefault;

                return (
                  <Box key={filterKey} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Select
                      value={filterKey}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const oldValue = filterValues[filterKey];
                        const newActiveFilters = activeFilters.map((f) => (f === filterKey ? newKey : f));
                        const newFilterValues = { ...filterValues };
                        delete newFilterValues[filterKey];
                        newFilterValues[newKey] = oldValue;
                        setActiveFilters(newActiveFilters);
                        setFilterValues(newFilterValues);
                      }}
                      size="small"
                      disabled={isDisabled}
                      sx={{ minWidth: 180 }}
                    >
                      {availableFilters
                        .filter((f) => !activeFilters.includes(f.value) || f.value === filterKey)
                        .map((f) => (
                          <MenuItem key={f.value} value={f.value}>
                            {f.label}
                          </MenuItem>
                        ))}
                    </Select>

                    {filterKey === 'tanggal' && (
                      <DatePicker
                        value={filterValues[filterKey] ? dayjs(filterValues[filterKey]) : null}
                        onChange={(newValue) => {
                          handleFilterValueChange(filterKey, newValue ? newValue.toDate() : null);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: { flex: 1 },
                          },
                        }}
                      />
                    )}

                    {filterKey === 'jenisUser' && (
                      <Select
                        value={filterValues[filterKey] || ''}
                        onChange={(e) => handleFilterValueChange(filterKey, e.target.value)}
                        size="small"
                        displayEmpty
                        sx={{ flex: 1 }}
                      >
                        <MenuItem value="">Semua Jenis User</MenuItem>
                        {jenisUserOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}

                    {filterKey === 'cariMember' && (
                      <Autocomplete
                        options={memberOptions}
                        value={filterValues[filterKey] || null}
                        onChange={(event, newValue) => {
                          handleFilterValueChange(filterKey, newValue || '');
                        }}
                        onInputChange={(event, newInputValue) => {
                          handleFilterValueChange(filterKey, newInputValue);
                        }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Cari Member"
                            sx={{ flex: 1 }}
                          />
                        )}
                        sx={{ flex: 1 }}
                      />
                    )}

                    {filterKey === 'mode' && (
                      <Select
                        value={filterValues[filterKey] || ''}
                        onChange={(e) => handleFilterValueChange(filterKey, e.target.value)}
                        size="small"
                        displayEmpty
                        sx={{ flex: 1 }}
                      >
                        <MenuItem value="">Semua Mode</MenuItem>
                        {modeOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}

                    {!isDefault && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFilter(filterKey)}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'error.light',
                          },
                        }}
                      >
                        <CloseCircle size={18} color="#d32f2f" />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
            <Button
              variant="outlined"
              startIcon={<Add size={18} color="#3b82f6" />}
              onClick={handleAddFilter}
              disabled={activeFilters.length >= availableFilters.length}
              sx={{
                textTransform: 'none',
                alignSelf: 'flex-start',
                borderColor: '#3b82f6',
                color: '#3b82f6',
                '&:hover': {
                  borderColor: '#2563eb',
                  bgcolor: 'rgba(59, 130, 246, 0.08)',
                },
                '&:disabled': {
                  borderColor: '#d1d5db',
                  color: '#9ca3af',
                },
              }}
            >
              Tambah Filter
            </Button>
          </Box>
          </LocalizationProvider>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Detail Dialog */}
      <ParentMemberLogDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, log: null })}
        log={detailDialog.log}
      />
    </Box>
  );
}
