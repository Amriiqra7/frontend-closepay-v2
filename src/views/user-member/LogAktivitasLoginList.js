'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';

// Mock data untuk log aktivitas login
const generateMockLogs = () => {
  const logs = [];
  const roles = ['Member', 'Admin', 'Superadmin'];
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
  ];
  const ipAddresses = ['49.156.22.185', '192.168.1.1', '10.0.0.1', '172.16.0.1'];

  for (let i = 1; i <= 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 2));
    date.setHours(9 + (i % 12), 44 + (i % 20), 50 + (i % 10));

    logs.push({
      id: i,
      tanggalLogin: date,
      namaPengguna: `useryeni${i}`,
      userAgent: userAgents[i % userAgents.length],
      role: roles[i % roles.length],
      ipAddress: ipAddresses[i % ipAddresses.length],
    });
  }

  return logs;
};

const mockLogs = generateMockLogs();

export default function LogAktivitasLoginList() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [roleFilter, setRoleFilter] = useState('');
  const [searchUsername, setSearchUsername] = useState('');

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleDateRangeChange = useCallback((field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleRoleFilterChange = useCallback((event) => {
    setRoleFilter(event.target.value);
  }, []);

  const handleSearchUsernameChange = useCallback((event) => {
    setSearchUsername(event.target.value);
  }, []);

  const handleResetFilter = useCallback(() => {
    setDateRange({ start: null, end: null });
    setRoleFilter('');
    setSearchUsername('');
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => dateRange.start || dateRange.end || roleFilter || searchUsername,
    [dateRange, roleFilter, searchUsername]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...mockLogs];

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.tanggalLogin);
        return itemDate.isSameOrAfter(dayjs(dateRange.start).startOf('day'));
      });
    }
    if (dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.tanggalLogin);
        return itemDate.isSameOrBefore(dayjs(dateRange.end).endOf('day'));
      });
    }

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter((item) => item.role === roleFilter);
    }

    // Filter by username
    if (searchUsername) {
      filtered = filtered.filter((item) =>
        item.namaPengguna.toLowerCase().includes(searchUsername.toLowerCase())
      );
    }

    return filtered;
  }, [dateRange, roleFilter, searchUsername]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    const sorted = [...filteredData];
    const sort = sorting[0];
    sorted.sort((a, b) => {
      let aVal, bVal;

      if (sort.id === 'tanggalLogin') {
        aVal = new Date(a.tanggalLogin).getTime();
        bVal = new Date(b.tanggalLogin).getTime();
      } else {
        aVal = a[sort.id]?.toString().toLowerCase() || '';
        bVal = b[sort.id]?.toString().toLowerCase() || '';
      }

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
        accessorKey: 'tanggalLogin',
        header: 'Tanggal Login',
        size: 180,
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {dayjs(date).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'namaPengguna',
        header: 'Nama Pengguna',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'userAgent',
        header: 'User Agent',
        size: 400,
        Cell: ({ cell }) => (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 120,
        Cell: ({ cell }) => {
          const role = cell.getValue();
          return (
            <Chip
              label={role}
              size="small"
              sx={{
                bgcolor: '#dbeafe',
                color: '#1e40af',
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
        accessorKey: 'ipAddress',
        header: 'IP Address',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
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
    manualFiltering: true,
    autoResetPageIndex: false,
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        {/* Toolbar dengan tombol Filter */}
        <Box
          sx={{
            p: 2,
            pt: 2,
            display: 'flex',
            alignItems: 'center',
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
          <Grid item xs={12} sm={6} md={4}>
            <DatePicker
              label="Tanggal Mulai"
              value={dateRange.start ? dayjs(dateRange.start) : null}
              onChange={(newValue) => {
                handleDateRangeChange('start', newValue ? newValue.toDate() : null);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DatePicker
              label="Tanggal Akhir"
              value={dateRange.end ? dayjs(dateRange.end) : null}
              onChange={(newValue) => {
                handleDateRangeChange('end', newValue ? newValue.toDate() : null);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
          </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            displayEmpty
            fullWidth
            size="small"
            renderValue={(selected) => {
              if (!selected) {
                return <Typography sx={{ color: 'text.secondary' }}>Pilih Role</Typography>;
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
            <MenuItem value="">Semua Role</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Superadmin">Superadmin</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            placeholder="Cari Nama Pengguna"
            value={searchUsername}
            onChange={handleSearchUsernameChange}
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
        <Box sx={{ pb: 5 }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
