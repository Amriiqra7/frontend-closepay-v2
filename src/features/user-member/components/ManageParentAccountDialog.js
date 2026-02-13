'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import TablePagination from '@/shared/ui/TablePagination';
import AlertDialog from '@/shared/ui/AlertDialog';
import { showSuccessToast } from '@/shared/utils/toast';

// Mock data untuk parent members
const generateMockParentMembers = () => {
  const members = [];
  const sampleData = [
    {
      nama: 'keluargaaaa',
      username: 'keluargaaaa',
      email: 'closepay@coba.com',
      noTelp: '0942611512121',
      status: 'Aktif',
    },
    {
      nama: 'Bontot family',
      username: 'bontotfamily',
      email: 'bontot@bontot.solusi',
      noTelp: '0822222222223',
      status: 'Aktif',
    },
    {
      nama: 'yeyenfamilyyy',
      username: 'yeyenfamily',
      email: 'keluargabaruyeni@solusi.com',
      noTelp: '089647483',
      status: 'Aktif',
    },
  ];

  for (let i = 1; i <= 20; i++) {
    const baseData = sampleData[(i - 1) % sampleData.length];
    members.push({
      id: i,
      nama: `${baseData.nama} ${i > 3 ? i : ''}`.trim(),
      username: `${baseData.username}${i > 3 ? i : ''}`.trim(),
      email: `parent${i}@example.com`,
      noTelp: baseData.noTelp || `08${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      status: i % 10 === 0 ? 'Nonaktif' : 'Aktif',
    });
  }

  return members;
};

const mockParentMembers = generateMockParentMembers();

export default function ManageParentAccountDialog({ open, onClose, member }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [connectedParentAccount, setConnectedParentAccount] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [columnOrder] = useState(['select', 'index', 'nama', 'username', 'email', 'noTelp', 'status']);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setShowTable(false);
      setSelectedParentId(null);
      setSearchValue('');
      setSearchBy('');
      setStatusFilter('');
      setColumnFilters([]);
      setPagination({ pageIndex: 0, pageSize: 10 });
      setDeleteDialogOpen(false);
    } else {
      // TODO: Fetch connected parent account from API
      // For now, using mock data - set to null initially
      setConnectedParentAccount(null);
    }
  }, [open, member]);

  const handleShowTable = useCallback(() => {
    setShowTable(true);
  }, []);

  const handleBack = useCallback(() => {
    setShowTable(false);
    setSelectedParentId(null);
  }, []);

  const handleConnect = useCallback(() => {
    if (!selectedParentId) {
      showSuccessToast('Silakan pilih akun induk terlebih dahulu');
      return;
    }
    
    // Find selected parent account
    const selectedParent = mockParentMembers.find(p => p.id === selectedParentId);
    if (!selectedParent) {
      showSuccessToast('Akun induk tidak ditemukan');
      return;
    }
    
    // TODO: Implement API call to connect parent account
    setConnectedParentAccount(selectedParent);
    setShowTable(false);
    setSelectedParentId(null);
    showSuccessToast('Akun induk berhasil dihubungkan');
  }, [selectedParentId]);

  const handleChangeParentAccount = useCallback(() => {
    setShowTable(true);
    setSelectedParentId(null);
  }, []);

  const handleDeleteParentAccount = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    // TODO: Implement API call to delete parent account connection
    setConnectedParentAccount(null);
    setDeleteDialogOpen(false);
    showSuccessToast('Akun induk berhasil dihapus');
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...mockParentMembers];

    if (searchValue && searchBy) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((item) => {
        const value = item[searchBy]?.toString().toLowerCase() || '';
        return value.includes(searchLower);
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [searchValue, searchBy, statusFilter]);

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

  const handleSearchByChange = useCallback((event) => {
    setSearchBy(event.target.value);
    setSearchValue('');
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((event) => {
    setStatusFilter(event.target.value);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSearchValue('');
    setSearchBy('');
    setStatusFilter('');
  }, []);

  const hasActiveFilters = useMemo(
    () => searchValue || searchBy || statusFilter,
    [searchValue, searchBy, statusFilter]
  );

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
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
        id: 'select',
        header: '',
        size: 50,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: {
          sx: {
            paddingRight: '0 !important',
            paddingLeft: '16px !important',
            backgroundColor: '#f9fafb',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            paddingRight: '0 !important',
            paddingLeft: '16px !important',
          },
        },
        Cell: ({ row }) => {
          const isSelected = selectedParentId === row.original.id;
          return (
            <Radio
              checked={isSelected}
              onChange={() => {
                setSelectedParentId(row.original.id);
              }}
              value={row.original.id}
              sx={{
                color: '#1976d2',
                padding: '0',
                margin: '0',
                '&.Mui-checked': {
                  color: '#1976d2',
                },
              }}
            />
          );
        },
      },
      {
        accessorKey: 'index',
        header: 'NO',
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: { 
          align: 'center',
          sx: {
            paddingLeft: '0 !important',
            fontSize: '12px !important',
            fontWeight: 600,
            color: '#374151',
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb',
          },
        },
        muiTableBodyCellProps: { 
          align: 'center',
          sx: {
            paddingLeft: '0 !important',
            fontSize: '12px !important',
          },
        },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', fontSize: '12px' }}>
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
        accessorKey: 'username',
        header: 'Nama Pengguna',
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
        accessorKey: 'noTelp',
        header: 'No. Telp',
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
            <Box
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: isAktif ? '#d1fae5' : '#fee2e2',
                color: isAktif ? '#065f46' : '#991b1b',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {status}
            </Box>
          );
        },
      },
    ],
    [selectedParentId]
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
      columnOrder,
    },
    initialState: {
      density: 'compact',
      columnOrder: ['select', 'index', 'nama', 'username', 'email', 'noTelp', 'status'],
    },
    enableRowNumbers: false,
    enableRowActions: false,
    enableRowSelection: false,
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

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography component="span" variant="h6" fontWeight="bold">
          Pengaturan Akun Induk
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#6b7280',
            '&:hover': {
              bgcolor: '#f3f4f6',
            },
          }}
        >
          <CloseCircle size={20} color="#6b7280" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Data Member - Always visible */}
        <Box sx={{ pt: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#6b7280' }}>
            Data Member
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2,
              p: 2,
              bgcolor: '#f9fafb',
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                Nama
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {member.nama || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                Email
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {member.email || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                Username
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {member.username || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                No Telp
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {member.noTelp || '-'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Akun Induk - Show when connected */}
        {connectedParentAccount && !showTable && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Akun Induk
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleChangeParentAccount}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      bgcolor: '#e3f2fd',
                    },
                  }}
                >
                  Ganti Akun Induk
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDeleteParentAccount}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#b71c1c',
                      bgcolor: '#ffebee',
                    },
                  }}
                >
                  Hapus Akun Induk
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
                p: 2,
                bgcolor: '#f9fafb',
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                  Nama
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {connectedParentAccount.nama || '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {connectedParentAccount.email || '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                  Username
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {connectedParentAccount.username || '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                  No Telp
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {connectedParentAccount.noTelp || '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Table view: Show parent members table when showTable is true */}
        {showTable && (
          <Box sx={{ pt: 2 }}>
            {/* Filter Section */}
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
                      username: 'Nama Pengguna',
                      email: 'Email',
                      noTelp: 'No. Telp',
                    };
                    return labels[selected] || selected;
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
                  <MenuItem value="username">Nama Pengguna</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="noTelp">No. Telp</MenuItem>
                </Select>
              </Grid>
              {searchBy && (
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    placeholder={`Cari ${searchBy === 'nama' ? 'Nama' : searchBy === 'username' ? 'Nama Pengguna' : searchBy === 'email' ? 'Email' : 'No. Telp'}...`}
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
              )}
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
                  <MenuItem value="Nonaktif">Tidak Aktif</MenuItem>
                </Select>
              </Grid>
            </FilterCollapse>

            {/* Table */}
            <Box sx={{ pb: 5 }} key={`table-wrapper-${selectedParentId}`}>
              <MaterialReactTable table={table} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        {!showTable ? (
          <>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  bgcolor: '#fee2e2',
                },
              }}
            >
              Kembali
            </Button>
            {!connectedParentAccount && (
              <Button
                onClick={handleShowTable}
                variant="contained"
                sx={{
                  textTransform: 'none',
                }}
              >
                Hubungkan Akun Induk
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={handleBack}
              variant="outlined"
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
            <Button
              onClick={handleConnect}
              variant="contained"
              disabled={!selectedParentId}
              sx={{
                textTransform: 'none',
              }}
            >
              Hubungkan
            </Button>
          </>
        )}
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Akun Induk"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus akun induk <strong>{connectedParentAccount && connectedParentAccount.nama}</strong>?
          </Typography>
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Dialog>
  );
}
