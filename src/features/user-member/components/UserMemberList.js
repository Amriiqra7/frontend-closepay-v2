'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Popover,
  Menu,
  Divider,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Add, Eye, Edit, Archive, Refresh2, People, DocumentUpload, Tag, DocumentDownload, MoreCircle } from 'iconsax-react';
import dynamic from 'next/dynamic';
import TablePagination from '@/shared/ui/TablePagination';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import MainCard from '@/shared/ui/MainCard';
import AlertDialog from '@/shared/ui/AlertDialog';
import { showSuccessToast } from '@/shared/utils/toast';
import DownloadDataDialog from './DownloadDataDialog';
import UploadDataTermsDialog from './UploadDataTermsDialog';
import UploadDataDialog from './UploadDataDialog';
import UpdateTagsDialog from './UpdateTagsDialog';
import UserMemberDetailDialog from './UserMemberDetailDialog';
import ManageParentAccountDialog from './ManageParentAccountDialog';

// Dynamic import untuk menghindari SSR issues dengan ApexCharts
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Sample data - replace with actual API call
const generateMockMembers = () => {
  const members = [];
  const sampleData = [
    {
      nama: 'Member 1',
      noId: '060501123',
      email: 'member1@example.com',
      username: 'member1',
      noTelp: '0823295123',
      status: 'Aktif',
    },
    {
      nama: 'Member 2',
      noId: '321',
      email: 'member2@example.com',
      username: 'member2',
      noTelp: '082231381528',
      status: 'Aktif',
    },
    {
      nama: 'Member 3',
      noId: '15926',
      email: 'member3@example.com',
      username: 'member3',
      noTelp: '081234567890',
      status: 'Aktif',
    },
  ];

  for (let i = 1; i <= 50; i++) {
    const baseData = sampleData[(i - 1) % sampleData.length];
    members.push({
      id: i,
      nama: `${baseData.nama} ${i > 3 ? i : ''}`.trim(),
      noId: `${baseData.noId}${i}`,
      email: `member${i}@example.com`,
      username: `${baseData.username}${i}`,
      noTelp: `08${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      status: i % 10 === 0 ? 'Arsip' : 'Aktif',
      // Additional fields for detail dialog
      noIdentitas: `ID${String(i).padStart(6, '0')}`,
      nis: `NIS${String(i).padStart(6, '0')}`,
      tanggalLahir: new Date(1990 + (i % 30), i % 12, (i % 28) + 1),
      tempatLahir: `Kota ${i}`,
      alamat: `Jl. Contoh No. ${i}, RT ${i % 10}/RW ${(i % 5) + 1}`,
      tags: i % 3 === 0 ? 'tag1' : i % 3 === 1 ? 'tag2' : 'tag3',
    });
  }

  return members;
};

const mockMembers = generateMockMembers();

export default function UserMemberList() {
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
  const [timeRange, setTimeRange] = useState('7');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [datePickerAnchor, setDatePickerAnchor] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [uploadTermsDialogOpen, setUploadTermsDialogOpen] = useState(false);
  const [uploadDataDialogOpen, setUploadDataDialogOpen] = useState(false);
  const [updateTagsDialogOpen, setUpdateTagsDialogOpen] = useState(false);
  const [archiveMode, setArchiveMode] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [archiveMultipleDialogOpen, setArchiveMultipleDialogOpen] = useState(false);

  // Analytics data
  const analyticsData = useMemo(() => {
    const total = mockMembers.length;
    const aktif = mockMembers.filter((u) => u.status === 'Aktif').length;
    const arsip = mockMembers.filter((u) => u.status === 'Arsip').length;

    return {
      total,
      aktif,
      arsip,
    };
  }, []);

  // Generate dates for last 30 days
  const generateDates = (days) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
    });
  };

  // Donut chart options - minimalis
  const donutChartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    labels: ['Aktif', 'Arsip'],
    colors: ['#10b981', '#f59e0b'],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: false,
          },
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: (val) => `${val} member`,
      },
    },
    stroke: {
      width: 0,
    },
  };

  const donutChartSeries = [analyticsData.aktif, analyticsData.arsip];

  // Modern bar chart options
  const barChartOptions = useMemo(() => {
    const days = timeRange === '7' ? 7 : 30;
    const categories = generateDates(days);
    
    return {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        fontFamily: 'inherit',
        sparkline: { enabled: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          columnWidth: '90%',
          barHeight: '100%',
          dataLabels: {
            position: 'top',
          },
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent'],
      },
      xaxis: {
        categories,
        labels: {
          style: {
            fontSize: '11px',
            colors: '#6b7280',
            fontFamily: 'inherit',
          },
          rotate: -45,
          rotateAlways: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '11px',
            colors: '#6b7280',
            fontFamily: 'inherit',
          },
          formatter: (val) => Math.round(val).toString(),
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        opacity: 1,
        type: 'solid',
      },
      colors: ['#10b981', '#f59e0b'],
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 20,
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '12px',
        fontFamily: 'inherit',
        markers: {
          width: 8,
          height: 8,
          radius: 4,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 0,
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
        },
        theme: 'light',
        y: {
          formatter: (val) => `${Math.round(val)} member`,
        },
      },
    };
  }, [timeRange]);

  // Generate bar chart data
  const barChartSeries = useMemo(() => {
    const days = timeRange === '7' ? 7 : 30;
    return [
      {
        name: 'Aktif',
        data: Array.from({ length: days }, () => Math.floor(Math.random() * 20) + 5),
      },
      {
        name: 'Arsip',
        data: Array.from({ length: days }, () => Math.floor(Math.random() * 5) + 1),
      },
    ];
  }, [timeRange]);

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

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setStatusFilter('');
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => columnFilters.length > 0 || searchValue || statusFilter,
    [columnFilters, searchValue, statusFilter]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...mockMembers];

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

  // State untuk dialog
  const [detailDialog, setDetailDialog] = useState({ open: false, member: null });
  const [archiveDialog, setArchiveDialog] = useState({ open: false, member: null });
  const [resetPasswordDialog, setResetPasswordDialog] = useState({ open: false, member: null });
  const [manageParentAccountDialog, setManageParentAccountDialog] = useState({ open: false, member: null });

  const handleView = useCallback((member) => {
    setDetailDialog({ open: true, member });
  }, []);

  const handleEdit = useCallback((member) => {
    router.push(`/admin/utama/data-user/user-member/data-user/${member.noId}/edit`);
  }, [router]);

  const handleArchive = useCallback((member) => {
    setArchiveDialog({ open: true, member });
  }, []);

  const handleResetPassword = useCallback((member) => {
    setResetPasswordDialog({ open: true, member });
  }, []);

  const handleManageParentAccount = useCallback((member) => {
    setManageParentAccountDialog({ open: true, member });
  }, []);

  const handleConfirmArchive = useCallback(async () => {
    if (!archiveDialog.member) return;
    
    try {
      // TODO: Implement archive API call
      showSuccessToast(`Member "${archiveDialog.member.nama}" berhasil diarsipkan`);
      setArchiveDialog({ open: false, member: null });
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [archiveDialog.member]);

  const handleConfirmResetPassword = useCallback(async () => {
    if (!resetPasswordDialog.member) return;
    
    try {
      // TODO: Implement reset password API call
      showSuccessToast(`Password member "${resetPasswordDialog.member.nama}" berhasil direset`);
      setResetPasswordDialog({ open: false, member: null });
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [resetPasswordDialog.member]);

  const handleAdd = useCallback(() => {
    router.push('/admin/utama/data-user/user-member/data-user/new');
  }, [router]);

  const handleUploadData = useCallback(() => {
    setUploadTermsDialogOpen(true);
  }, []);

  const handleManageTags = useCallback(() => {
    router.push('/admin/utama/data-user/user-member/data-user/tags');
  }, [router]);

  const handleUpdateTags = useCallback(() => {
    setUpdateTagsDialogOpen(true);
  }, []);

  const handleManageParentAccounts = useCallback(() => {
    router.push('/admin/utama/data-user/user-member/data-user/parent-member');
  }, [router]);

  const selectedRowsCount = useMemo(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key]).length;
  }, [rowSelection]);

  const handleArchiveMembers = useCallback(() => {
    if (archiveMode && selectedRowsCount > 0) {
      // Jika sudah ada yang dipilih, buka dialog konfirmasi
      setArchiveMultipleDialogOpen(true);
    } else {
      // Aktifkan mode archive (tampilkan checkbox)
      setArchiveMode(true);
      setRowSelection({});
    }
  }, [archiveMode, selectedRowsCount]);

  const handleCancelArchiveMode = useCallback(() => {
    setArchiveMode(false);
    setRowSelection({});
  }, []);

  const handleConfirmArchiveMultiple = useCallback(async () => {
    try {
      // TODO: Implement archive multiple API call
      showSuccessToast(`${selectedRowsCount} member berhasil diarsipkan`);
      setArchiveMultipleDialogOpen(false);
      setArchiveMode(false);
      setRowSelection({});
      // TODO: Refresh data
    } catch (error) {
      // Error handling sudah di toast
    }
  }, [selectedRowsCount]);

  const handleDownloadData = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);

  const handleDownloadFormat = useCallback((format) => {
    showSuccessToast(`Data berhasil diunduh dalam format ${format}`);
    // TODO: Implement actual download
  }, []);

  const handleMoreMenuOpen = useCallback((event) => {
    setMoreMenuAnchor(event.currentTarget);
  }, []);

  const handleMoreMenuClose = useCallback(() => {
    setMoreMenuAnchor(null);
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
      rowSelection: archiveMode ? rowSelection : {},
    },
    initialState: {
      density: 'compact',
    },
    enableRowNumbers: false,
    enableRowActions: !archiveMode,
    enableRowSelection: archiveMode,
    enableSelectAll: archiveMode,
    enableMultiRowSelection: archiveMode,
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
    onRowSelectionChange: setRowSelection,
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
    muiSelectAllCheckboxProps: ({ table }) => {
      const isAllSelected = table.getIsAllRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();
      return {
        checked: isAllSelected,
        indeterminate: isSomeSelected,
        color: 'error',
        sx: {
          padding: '4px',
          '&.Mui-checked': {
            color: '#d32f2f !important',
          },
          '&.MuiCheckbox-indeterminate': {
            color: '#d32f2f !important',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
          },
        },
      };
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
    muiTableBodyRowProps: ({ row }) => {
      const isSelected = row.getIsSelected();
      return {
        selected: isSelected,
        sx: {
          backgroundColor: isSelected ? 'rgba(211, 47, 47, 0.08) !important' : 'transparent',
          '&.Mui-selected': {
            backgroundColor: 'rgba(211, 47, 47, 0.08) !important',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.12) !important',
            },
          },
          '&:hover': {
            backgroundColor: isSelected ? 'rgba(211, 47, 47, 0.12) !important' : '#f3f4f6 !important',
          },
        },
      };
    },
    muiSelectCheckboxProps: ({ row }) => {
      const isSelected = row.getIsSelected();
      return {
        checked: isSelected,
        color: 'error',
        sx: {
          padding: '4px',
          '&.Mui-checked': {
            color: '#d32f2f !important',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
          },
        },
      };
    },
    muiTablePaperProps: {
      elevation: 0,
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: '#ffffff',
    }),
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
        <Tooltip title="Pengaturan akun induk" arrow>
          <IconButton
            size="small"
            onClick={() => handleManageParentAccount(row.original)}
            sx={{
              color: '#9c27b0',
              '&:hover': {
                bgcolor: 'rgba(156, 39, 176, 0.08)',
              },
            }}
          >
            <People size={20} variant="Linear" color="#9c27b0" />
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
      {/* Analytics Section */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Member Analytics - Donut Chart */}
        <Box sx={{ flex: '0 0 40%', minWidth: 0 }}>
          <MainCard sx={{ height: '500px', display: 'flex', flexDirection: 'column', boxShadow: 'none' }}>
            <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#111827' }}>
                Analitik Member
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Ringkasan jumlah dan klasifikasi member
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <Chart
                    options={donutChartOptions}
                    series={donutChartSeries}
                    type="donut"
                    height={200}
                  />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                    Total Member
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                    {analyticsData.total}
                  </Typography>
                </Box>
                <Stack spacing={1.5} sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: '#10b981',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Aktif
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                      {analyticsData.aktif}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: '#f59e0b',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Arsip
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                      {analyticsData.arsip}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </MainCard>
        </Box>

        {/* Growth Analytics - Bar Chart */}
        <Box sx={{ flex: '1 1 auto', minWidth: 0, width: '100%' }}>
          <MainCard sx={{ height: '500px', display: 'flex', flexDirection: 'column', width: '100%', boxShadow: 'none' }}>
            <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexShrink: 0 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#111827' }}>
                    Analitik Pertumbuhan Member
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Pertumbuhan member
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <ToggleButtonGroup
                    value={timeRange}
                    exclusive
                    onChange={(e, newValue) => {
                      if (newValue === 'custom') {
                        setDatePickerAnchor(e.currentTarget);
                      } else {
                        setTimeRange(newValue);
                        setDatePickerAnchor(null);
                      }
                    }}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 1.5,
                        py: 0.5,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        borderColor: '#e5e7eb',
                        color: '#6b7280',
                        '&.Mui-selected': {
                          bgcolor: '#155DFC',
                          color: '#fff',
                          borderColor: '#155DFC',
                          '&:hover': {
                            bgcolor: '#0d4fc7',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="7">7 Hari</ToggleButton>
                    <ToggleButton value="30">30 Hari</ToggleButton>
                    <ToggleButton value="custom">Kustom</ToggleButton>
                  </ToggleButtonGroup>
                  <Popover
                    open={Boolean(datePickerAnchor)}
                    anchorEl={datePickerAnchor}
                    onClose={() => {
                      setDatePickerAnchor(null);
                      if (!dateRange.start || !dateRange.end) {
                        setTimeRange('30');
                      }
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
                      <TextField
                        label="Tanggal Mulai"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, start: e.target.value });
                        }}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        label="Tanggal Akhir"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => {
                          const newRange = { ...dateRange, end: e.target.value };
                          setDateRange(newRange);
                          if (newRange.start && newRange.end) {
                            setTimeRange('custom');
                            setTimeout(() => setDatePickerAnchor(null), 100);
                          }
                        }}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                  </Popover>
                </Box>
              </Box>
              <Box sx={{ width: '100%', flex: 1, minHeight: 0, position: 'relative' }}>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Chart
                    options={barChartOptions}
                    series={barChartSeries}
                    type="bar"
                    width="100%"
                    height={350}
                  />
                </Box>
              </Box>
            </Box>
          </MainCard>
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: '100%'}}>
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
            {archiveMode && (
              <Button
                variant="outlined"
                onClick={handleCancelArchiveMode}
                sx={{
                  textTransform: 'none',
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    bgcolor: '#f9fafb',
                  },
                }}
              >
                Batal
              </Button>
            )}
            {!archiveMode && (
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
            )}
            {archiveMode && selectedRowsCount > 0 && (
              <Button
                variant="contained"
                startIcon={<Archive size={20} color="white" />}
                onClick={handleArchiveMembers}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#d32f2f',
                  '&:hover': {
                    bgcolor: '#b71c1c',
                  },
                }}
              >
                Arsip Member ({selectedRowsCount})
              </Button>
            )}
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
            <Tooltip title="Aksi Lainnya" arrow>
              <IconButton
                onClick={handleMoreMenuOpen}
                sx={{
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    bgcolor: '#f9fafb',
                    borderColor: '#d1d5db',
                  },
                }}
              >
                <MoreCircle size={20} color="#6b7280" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={moreMenuAnchor}
              open={Boolean(moreMenuAnchor)}
              onClose={handleMoreMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 220,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleUploadData();
                  handleMoreMenuClose();
                }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#f0f9ff',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DocumentUpload size={20} color="#0ea5e9" />
                  <Typography variant="body2" sx={{ color: '#0ea5e9', fontWeight: 500 }}>
                    Upload Data Member
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleManageTags();
                  handleMoreMenuClose();
                }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#fef3c7',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Tag size={20} color="#f59e0b" />
                  <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 500 }}>
                    Kelola Tags Member
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleUpdateTags();
                  handleMoreMenuClose();
                }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#dbeafe',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Tag size={20} color="#3b82f6" />
                  <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 500 }}>
                    Update Tags Member
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleManageParentAccounts();
                  handleMoreMenuClose();
                }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#f3e8ff',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <People size={20} color="#9c27b0" />
                  <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 500 }}>
                    Pengelolaan Akun Induk
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleArchiveMembers();
                  handleMoreMenuClose();
                }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#fee2e2',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Archive size={20} color="#d32f2f" />
                  <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                    {archiveMode && selectedRowsCount > 0 
                      ? `Arsip Member (${selectedRowsCount})`
                      : 'Arsip Member'}
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>
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
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>
        </FilterCollapse>

        {/* MaterialReactTable */}
        <Box sx={{ pb: 5 }} key={`table-wrapper-${archiveMode}-${JSON.stringify(rowSelection)}`}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {/* Detail Dialog */}
      <UserMemberDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, member: null })}
        member={detailDialog.member}
      />

      {/* Archive Confirmation Dialog */}
      <AlertDialog
        open={archiveDialog.open}
        onClose={() => setArchiveDialog({ open: false, member: null })}
        onConfirm={handleConfirmArchive}
        title="Konfirmasi Archive"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan mengarsipkan member <strong>{archiveDialog.member?.nama}</strong>?
          </Typography>
        }
        confirmText="Ya, Archive"
        cancelText="Batal"
        confirmColor="error"
      />

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog
        open={resetPasswordDialog.open}
        onClose={() => setResetPasswordDialog({ open: false, member: null })}
        onConfirm={handleConfirmResetPassword}
        title="Konfirmasi Reset Password"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan mereset password member <strong>{resetPasswordDialog.member?.nama}</strong>?
          </Typography>
        }
        confirmText="Ya, Reset"
        cancelText="Batal"
        confirmColor="primary"
      />

      {/* Download Data Dialog */}
      <DownloadDataDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        onDownload={handleDownloadFormat}
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

      {/* Update Tags Dialog */}
      <UpdateTagsDialog
        open={updateTagsDialogOpen}
        onClose={() => setUpdateTagsDialogOpen(false)}
      />

      {/* Archive Multiple Confirmation Dialog */}
      <AlertDialog
        open={archiveMultipleDialogOpen}
        onClose={() => setArchiveMultipleDialogOpen(false)}
        onConfirm={handleConfirmArchiveMultiple}
        title="Konfirmasi Archive"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan mengarsipkan <strong>{selectedRowsCount}</strong> member yang dipilih?
          </Typography>
        }
        confirmText="Ya, Archive"
        cancelText="Batal"
        confirmColor="error"
      />

      {/* Manage Parent Account Dialog */}
      <ManageParentAccountDialog
        open={manageParentAccountDialog.open}
        onClose={() => setManageParentAccountDialog({ open: false, member: null })}
        member={manageParentAccountDialog.member}
      />
    </Box>
  );
}
