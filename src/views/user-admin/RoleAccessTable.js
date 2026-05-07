'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
  Chip,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import TablePagination from '@/shared/ui/TablePagination';
import { useFormikContext } from 'formik';

// Mock data untuk role access
const generateMockRoleAccesses = () => {
  const roleAccesses = [];
  const sampleData = [
    {
      id: 1,
      tipe: 'admin',
      nama: 'Admin - Membership Member Full Control',
      deskripsi: 'Admin hanya full control CRUD member saja',
      status: 'Aktif',
      diizinkan: false,
    },
    {
      id: 2,
      tipe: 'admin',
      nama: 'Admin - Membership Read Only',
      deskripsi: 'Admin hanya bisa get data admin, merchant, member',
      status: 'Aktif',
      diizinkan: false,
    },
    {
      id: 3,
      tipe: 'admin-sub-company',
      nama: 'Admin Sub Company - Full Control',
      deskripsi: 'Admin sub company dengan akses penuh',
      status: 'Aktif',
      diizinkan: false,
    },
  ];

  for (let i = 0; i < 20; i++) {
    const baseData = sampleData[i % sampleData.length];
    roleAccesses.push({
      ...baseData,
      id: i + 1,
      nama: `${baseData.nama} ${i > 2 ? `- ${i + 1}` : ''}`,
    });
  }

  return roleAccesses;
};

export default function RoleAccessTable() {
  const { values, setFieldValue } = useFormikContext();
  const [mockRoleAccesses] = useState(() => generateMockRoleAccesses());
  const [adminFilter, setAdminFilter] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Local state untuk track selection untuk immediate UI update
  const [localSelectedIds, setLocalSelectedIds] = useState(() => {
    return (values.roleAccesses || []).map((role) => role.id);
  });

  // Sync local state dengan Formik values
  useEffect(() => {
    const formikSelectedIds = (values.roleAccesses || []).map((role) => role.id);
    setLocalSelectedIds(formikSelectedIds);
  }, [values.roleAccesses]);

  const selectedRoleAccessIds = useMemo(() => {
    return localSelectedIds;
  }, [localSelectedIds]);

  const handleToggleRoleAccess = useCallback((roleAccess) => {
    const currentSelectedIds = localSelectedIds;
    const isSelected = currentSelectedIds.includes(roleAccess.id);
    
    // Update local state immediately for UI responsiveness
    if (isSelected) {
      const newIds = currentSelectedIds.filter((id) => id !== roleAccess.id);
      setLocalSelectedIds(newIds);
    } else {
      setLocalSelectedIds([...currentSelectedIds, roleAccess.id]);
    }
    
    // Update Formik values
    setFieldValue('roleAccesses', (prevRoles) => {
      const currentRoles = prevRoles || [];
      const isSelectedInFormik = currentRoles.some((role) => role.id === roleAccess.id);
      
      if (isSelectedInFormik) {
        return currentRoles.filter((role) => role.id !== roleAccess.id);
      } else {
        return [...currentRoles, roleAccess];
      }
    });
  }, [localSelectedIds, setFieldValue]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleResetFilter = useCallback(() => {
    setAdminFilter('');
    setSearchValue('');
  }, []);

  const hasActiveFilters = useMemo(
    () => adminFilter || searchValue,
    [adminFilter, searchValue]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...mockRoleAccesses];

    if (adminFilter) {
      filtered = filtered.filter((item) => item.tipe === adminFilter);
    }

    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchLower) ||
          item.deskripsi.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [mockRoleAccesses, adminFilter, searchValue]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.id - b.id);
  }, [filteredData]);

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


  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Toolbar dengan tombol Filter */}
      <Box
        sx={{
          pb: 2,
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
          <Select
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
            displayEmpty
            fullWidth
            size="small"
            renderValue={(selected) => {
              if (!selected) {
                return <Typography sx={{ color: 'text.secondary' }}>Admin</Typography>;
              }
              const labels = {
                admin: 'Admin',
                'admin-sub-company': 'Admin Sub Company',
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
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="admin-sub-company">Admin Sub Company</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Cari nama..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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

      {/* MUI Table */}
      <Box sx={{ pb: 4 }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: '500px',
            borderRadius: 0,
            border: 'none',
          }}
        >
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {/* Empty header for checkbox column */}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 60,
                  }}
                >
                  NO
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 120,
                  }}
                >
                  TIPE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 250,
                  }}
                >
                  NAMA
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 300,
                  }}
                >
                  DESKRIPSI
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 100,
                  }}
                >
                  STATUS
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 100,
                  }}
                >
                  DIIZINKAN
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => {
                const isChecked = selectedRoleAccessIds.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isChecked}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: '#f9fafb',
                      },
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleRoleAccess(row);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                      <Typography variant="body2">{row.index}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      <Typography variant="body2">{row.tipe}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      <Typography variant="body2">{row.nama}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {row.deskripsi}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor: row.status === 'Aktif' ? '#ecfdf5' : '#fef2f2',
                          color: row.status === 'Aktif' ? '#059669' : '#dc2626',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                      <Chip
                        label={row.diizinkan ? 'Ya' : 'Tidak'}
                        size="small"
                        sx={{
                          bgcolor: row.diizinkan ? '#ecfdf5' : '#fef2f2',
                          color: row.diizinkan ? '#059669' : '#dc2626',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          rowCount={sortedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Box>
    </Box>
  );
}
