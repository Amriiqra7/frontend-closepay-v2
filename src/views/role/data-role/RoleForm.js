"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  Button,
  FormHelperText,
  Chip,
  Grid,
} from "@mui/material";
import { useFormikContext } from "formik";
import { Security } from "iconsax-react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import FilterCollapse, { FilterButton } from "@/shared/ui/FilterCollapse";
import TablePagination from "@/shared/ui/TablePagination";

// Mock data untuk dropdown options
const mockCompanies = [
  { id: 1, nama: "PT Bougenvile Blok" },
  { id: 2, nama: "PT Kantin FKi 12" },
  { id: 3, nama: "PT Perusahaan ABC" },
  { id: 4, nama: "CV XYZ Indonesia" },
];

const mockUserTypes = [
  { id: 1, nama: "Administrator" },
  { id: 2, nama: "Manager" },
  { id: 3, nama: "Operator" },
  { id: 4, nama: "Viewer" },
];

// Mock data untuk izin keamanan
const generateMockIzinKeamanan = () => {
  return [
    {
      id: 1,
      service: "user",
      tipe: "admin",
      nama: "Membersip Activate or Deactivate Admin",
      kode: "user_membership_activate_deactivate_admin",
      deskripsi: "Membersip Activate or Deactivate Admin (user_membership_activate_deactivate_admin)",
      status: "aktif",
    },
    {
      id: 2,
      service: "user",
      tipe: "admin",
      nama: "Membersip Create Admin",
      kode: "user_membership_create_admin",
      deskripsi: "Membersip Create Admin (user_membership_create_admin)",
      status: "aktif",
    },
    {
      id: 3,
      service: "user",
      tipe: "admin",
      nama: "Membersip Get Admin",
      kode: "user_membership_get_admin",
      deskripsi: "Membersip Get Admin (user_membership_get_admin)",
      status: "aktif",
    },
    {
      id: 4,
      service: "user",
      tipe: "admin",
      nama: "Membersip Grant Role Admin",
      kode: "user_membership_grant_role_admin",
      deskripsi: "Membersip Grant Role Admin (user_membership_grant_role_admin)",
      status: "aktif",
    },
    {
      id: 5,
      service: "user",
      tipe: "admin",
      nama: "Membersip Revoke Role Admin",
      kode: "user_membership_revoke_role_admin",
      deskripsi: "Membersip Revoke Role Admin (user_membership_revoke_role_admin)",
      status: "aktif",
    },
    {
      id: 6,
      service: "user",
      tipe: "admin",
      nama: "Membersip Update Admin",
      kode: "user_membership_update_admin",
      deskripsi: "Membersip Update Admin (user_membership_update_admin)",
      status: "aktif",
    },
    {
      id: 7,
      service: "user",
      tipe: "admin",
      nama: "Membership Remove Security Code Member",
      kode: "user_membership_remove_security_code_member",
      deskripsi: "Membership Remove Security Code Member (user_membership_remove_security_code_member)",
      status: "aktif",
    },
    {
      id: 8,
      service: "user",
      tipe: "admin",
      nama: "Membership Reset Password Member",
      kode: "user_membership_reset_password_member",
      deskripsi: "Membership Reset Password Member (user_membership_reset_password_member)",
      status: "aktif",
    },
    {
      id: 9,
      service: "user",
      tipe: "admin",
      nama: "Membership Set Parent Member",
      kode: "user_membership_set_parent_member",
      deskripsi: "Membership Set Parent Member (user_membership_set_parent_member)",
      status: "aktif",
    },
    {
      id: 10,
      service: "user",
      tipe: "admin",
      nama: "Membersip Activate or Deactivate Member",
      kode: "user_membership_activate_deactivate_member",
      deskripsi: "Membersip Activate or Deactivate Member (user_membership_activate_deactivate_member)",
      status: "aktif",
    },
    {
      id: 11,
      service: "user",
      tipe: "admin",
      nama: "Membership Create Member",
      kode: "user_membership_create_member",
      deskripsi: "Membership Create Member (user_membership_create_member)",
      status: "aktif",
    },
    {
      id: 12,
      service: "user",
      tipe: "admin",
      nama: "Membership Get Member",
      kode: "user_membership_get_member",
      deskripsi: "Membership Get Member (user_membership_get_member)",
      status: "aktif",
    },
    {
      id: 13,
      service: "user",
      tipe: "admin",
      nama: "Membership Update Member",
      kode: "user_membership_update_member",
      deskripsi: "Membership Update Member (user_membership_update_member)",
      status: "aktif",
    },
    {
      id: 14,
      service: "user",
      tipe: "admin",
      nama: "Membership Grant Role Member",
      kode: "user_membership_grant_role_member",
      deskripsi: "Membership Grant Role Member (user_membership_grant_role_member)",
      status: "aktif",
    },
    {
      id: 15,
      service: "user",
      tipe: "admin",
      nama: "Membership Revoke Role Member",
      kode: "user_membership_revoke_role_member",
      deskripsi: "Membership Revoke Role Member (user_membership_revoke_role_member)",
      status: "aktif",
    },
    {
      id: 16,
      service: "user",
      tipe: "member",
      nama: "Membership View Profile",
      kode: "user_membership_view_profile",
      deskripsi: "Membership View Profile (user_membership_view_profile)",
      status: "aktif",
    },
    {
      id: 17,
      service: "user",
      tipe: "member",
      nama: "Membership Edit Profile",
      kode: "user_membership_edit_profile",
      deskripsi: "Membership Edit Profile (user_membership_edit_profile)",
      status: "aktif",
    },
    {
      id: 18,
      service: "user",
      tipe: "member",
      nama: "Membership Change Password",
      kode: "user_membership_change_password",
      deskripsi: "Membership Change Password (user_membership_change_password)",
      status: "aktif",
    },
    {
      id: 19,
      service: "user",
      tipe: "member",
      nama: "Membership View Transactions",
      kode: "user_membership_view_transactions",
      deskripsi: "Membership View Transactions (user_membership_view_transactions)",
      status: "aktif",
    },
    {
      id: 20,
      service: "user",
      tipe: "member",
      nama: "Membership View Balance",
      kode: "user_membership_view_balance",
      deskripsi: "Membership View Balance (user_membership_view_balance)",
      status: "aktif",
    },
    {
      id: 21,
      service: "transaction",
      tipe: "admin",
      nama: "Transaction Create Admin",
      kode: "transaction_create_admin",
      deskripsi: "Transaction Create Admin (transaction_create_admin)",
      status: "aktif",
    },
    {
      id: 22,
      service: "transaction",
      tipe: "admin",
      nama: "Transaction Get Admin",
      kode: "transaction_get_admin",
      deskripsi: "Transaction Get Admin (transaction_get_admin)",
      status: "aktif",
    },
    {
      id: 23,
      service: "transaction",
      tipe: "admin",
      nama: "Transaction Update Admin",
      kode: "transaction_update_admin",
      deskripsi: "Transaction Update Admin (transaction_update_admin)",
      status: "aktif",
    },
    {
      id: 24,
      service: "transaction",
      tipe: "admin",
      nama: "Transaction Delete Admin",
      kode: "transaction_delete_admin",
      deskripsi: "Transaction Delete Admin (transaction_delete_admin)",
      status: "aktif",
    },
  ];
};

const mockIzinKeamanan = generateMockIzinKeamanan();

export default function RoleForm() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const [showPermissionTable, setShowPermissionTable] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPengguna, setFilterPengguna] = useState("");
  const [filterAdmin, setFilterAdmin] = useState("");
  const [filterGrup, setFilterGrup] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const isInitializingRef = useRef(false);

  const handleOpenPermissionDialog = () => {
    // Initialize rowSelection from formik values before opening table
    if (values.izinKeamanan && Array.isArray(values.izinKeamanan) && values.izinKeamanan.length > 0) {
      const selectedIds = {};
      values.izinKeamanan.forEach((item) => {
        if (item && item.id) {
          selectedIds[item.id.toString()] = true;
        }
      });
      setRowSelection(selectedIds);
    } else {
      setRowSelection({});
    }
    isInitializingRef.current = true;
    setShowPermissionTable(true);
    // Reset flag after a short delay
    setTimeout(() => {
      isInitializingRef.current = false;
    }, 100);
  };

  const handleClosePermissionTable = () => {
    // Update formik values only when closing table
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const selectedItems = mockIzinKeamanan.filter((item) =>
      selectedIds.includes(item.id.toString())
    );
    setFieldValue("izinKeamanan", selectedItems, false);
    
    setShowPermissionTable(false);
    isInitializingRef.current = false;
  };

  // Update formik values only when table is closed to avoid interfering with checkbox rendering
  // NO useEffect for rowSelection changes - it interferes with real-time checkbox updates!

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === "boolean") {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setFilterPengguna("");
    setFilterAdmin("");
    setFilterGrup("");
    setFilterNama("");
    setColumnFilters([]);
  }, []);

  const hasActiveFilters = useMemo(
    () => filterPengguna || filterAdmin || filterGrup || filterNama,
    [filterPengguna, filterAdmin, filterGrup, filterNama]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...mockIzinKeamanan];

    if (filterPengguna) {
      filtered = filtered.filter((item) =>
        item.service?.toLowerCase().includes(filterPengguna.toLowerCase())
      );
    }
    if (filterAdmin) {
      filtered = filtered.filter((item) =>
        item.tipe?.toLowerCase().includes(filterAdmin.toLowerCase())
      );
    }
    if (filterGrup) {
      filtered = filtered.filter((item) =>
        item.tipe?.toLowerCase().includes(filterGrup.toLowerCase())
      );
    }
    if (filterNama) {
      filtered = filtered.filter((item) =>
        item.nama?.toLowerCase().includes(filterNama.toLowerCase())
      );
    }

    // Apply column filters
    columnFilters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const value = item[filter.id]?.toString().toLowerCase() || "";
          return value.includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [filterPengguna, filterAdmin, filterGrup, filterNama, columnFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    const sorted = [...filteredData];
    const sort = sorting[0];
    sorted.sort((a, b) => {
      const aVal = a[sort.id] || "";
      const bVal = b[sort.id] || "";
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
        accessorKey: "index",
        header: "No",
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "service",
        header: "Service",
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "tipe",
        header: "Tipe",
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "nama",
        header: "Nama",
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "kode",
        header: "Kode",
        size: 300,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "deskripsi",
        header: "Deskripsi",
        size: 400,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        enableSorting: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const isAktif = status === "aktif";
          return (
            <Chip
              label={isAktif ? "Aktif" : "Nonaktif"}
              size="small"
              sx={{
                bgcolor: isAktif ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                color: isAktif ? "#4caf50" : "#f44336",
                fontWeight: 500,
                fontSize: "0.75rem",
                height: 24,
                "& .MuiChip-label": {
                  px: 1.5,
                },
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
      rowSelection,
    },
    initialState: {
      density: "compact",
    },
    enableRowNumbers: false,
    enableRowSelection: true,
    enableSelectAll: true,
    enableMultiRowSelection: true,
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
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: "12px !important",
        backgroundColor: "rgba(248, 249, 250, 1)",
        borderTop: "1px solid rgba(232, 235, 238, 1) !important",
        borderBottom: "2px solid rgba(232, 235, 238, 1) !important",
        "& .MuiTableSortLabel-icon, & .MuiIconButton-root, & .MuiBadge-root": {
          opacity: 0,
          transition: "opacity 0.2s ease-in-out",
        },
        "&:hover .MuiTableSortLabel-icon, &:hover .MuiIconButton-root, &:hover .MuiBadge-root": {
          opacity: 1,
        },
        "& .MuiTableSortLabel-active .MuiTableSortLabel-icon": {
          opacity: 1,
        },
      }),
    },
    muiTableBodyCellProps: {
      sx: { fontSize: "12px !important" },
    },
    muiSelectAllCheckboxProps: ({ table }) => {
      const isAllSelected = table.getIsAllRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();
      return {
        checked: isAllSelected,
        indeterminate: isSomeSelected,
        sx: {
          padding: "4px",
          "&.Mui-checked": {
            color: "#155DFC !important",
          },
          "&.MuiCheckbox-indeterminate": {
            color: "#155DFC !important",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
          },
        },
      };
    },
    muiSelectCheckboxProps: ({ row }) => {
      const isSelected = row.getIsSelected();
      return {
        checked: isSelected,
        sx: {
          padding: "4px",
          "&.Mui-checked": {
            color: "#155DFC !important",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
          },
        },
      };
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        "& tr:nth-of-type(even)": {
          backgroundColor: "rgba(248, 249, 250, 1) !important",
        },
      }),
    },
    muiTableBodyRowProps: ({ row }) => {
      const isSelected = row.getIsSelected();
      return {
        selected: isSelected,
        sx: {
          backgroundColor: isSelected
            ? "rgba(21, 93, 252, 0.08) !important"
            : "transparent",
          "&.Mui-selected": {
            backgroundColor: "rgba(21, 93, 252, 0.08) !important",
            "&:hover": {
              backgroundColor: "rgba(21, 93, 252, 0.12) !important",
            },
          },
          "&:hover": {
            backgroundColor: isSelected
              ? "rgba(21, 93, 252, 0.12) !important"
              : "#f3f4f6 !important",
          },
        },
      };
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        mb: 4,
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: "rgba(255, 255, 255, 1)",
    }),
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 2,
        border: "none"
      }}
    >
      {/* Perusahaan */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          Perusahaan<span style={{ color: "red" }}> *</span>
        </Typography>
        <Autocomplete
          fullWidth
          size="small"
          options={mockCompanies}
          getOptionLabel={(option) => option?.nama || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          value={values.perusahaan}
          onChange={(_, newValue) => {
            setFieldValue("perusahaan", newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Pilih perusahaan"
              error={Boolean(touched.perusahaan && errors.perusahaan)}
              helperText={
                touched.perusahaan && errors.perusahaan
                  ? errors.perusahaan
                  : ""
              }
              InputProps={{
                ...params.InputProps,
                sx: { fontSize: '0.875rem' }
              }}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
              }}
            />
          )}
        />
      </Box>

      {/* Nama */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          Nama<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={values.nama}
          onChange={(e) => setFieldValue("nama", e.target.value)}
          placeholder="Nama"
          error={Boolean(touched.nama && errors.nama)}
          helperText={touched.nama && errors.nama}
          required
          InputProps={{
            sx: { fontSize: '0.875rem' }
          }}
          inputProps={{
            style: { fontSize: '0.875rem' }
          }}
          FormHelperTextProps={{
            sx: { fontSize: '0.75rem' }
          }}
        />
      </Box>

      {/* User Tipe */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          User Tipe<span style={{ color: "red" }}> *</span>
        </Typography>
        <Autocomplete
          fullWidth
          size="small"
          options={mockUserTypes}
          getOptionLabel={(option) => option?.nama || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          value={values.userTipe}
          onChange={(_, newValue) => {
            setFieldValue("userTipe", newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Pilih user tipe"
              error={Boolean(touched.userTipe && errors.userTipe)}
              helperText={
                touched.userTipe && errors.userTipe
                  ? errors.userTipe
                  : ""
              }
              InputProps={{
                ...params.InputProps,
                sx: { fontSize: '0.875rem' }
              }}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
              }}
            />
          )}
        />
      </Box>

      {/* Deskripsi */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          Deskripsi
        </Typography>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={4}
          value={values.deskripsi}
          onChange={(e) => setFieldValue("deskripsi", e.target.value)}
          placeholder="Deskripsi"
          error={Boolean(touched.deskripsi && errors.deskripsi)}
          helperText={touched.deskripsi && errors.deskripsi}
          InputProps={{
            sx: { fontSize: '0.875rem' }
          }}
          inputProps={{
            style: { fontSize: '0.875rem' }
          }}
          FormHelperTextProps={{
            sx: { fontSize: '0.75rem' }
          }}
        />
      </Box>

      {/* Pilih Izin Keamanan / Batal Button */}
      <Box sx={{ gridColumn: { xs: "1 / -1", md: "1" } }}>
        {!showPermissionTable ? (
          <Button
            variant="contained"
            startIcon={<Security size={20} color="currentColor" />}
            onClick={handleOpenPermissionDialog}
            sx={{
              textTransform: "none",
              width: "100%",
              justifyContent: "flex-start",
              bgcolor: "#155DFC",
              "&:hover": {
                bgcolor: "#0f4fc7",
              },
            }}
          >
            Pilih Izin Keamanan
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClosePermissionTable}
            sx={{
              textTransform: "none",
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            Batal
          </Button>
        )}
        {touched.izinKeamanan && errors.izinKeamanan && (
          <FormHelperText error sx={{ mt: 0.5, fontSize: "0.75rem" }}>
            {errors.izinKeamanan}
          </FormHelperText>
        )}
      </Box>

      {/* Tabel Izin Keamanan */}
      {showPermissionTable && (
        <Box
          sx={{
            gridColumn: "1 / -1",
            mt: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Header dengan Filter */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              backgroundColor: "white",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ flex: 1 }}>
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
              border: "none",
              backgroundColor: "white",
              borderBottom: "1px solid",
              borderColor: "divider",
              mt: 0,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Pengguna"
                  value={filterPengguna}
                  onChange={(e) => setFilterPengguna(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Admin"
                  value={filterAdmin}
                  onChange={(e) => setFilterAdmin(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Grup"
                  value={filterGrup}
                  onChange={(e) => setFilterGrup(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Nama"
                  value={filterNama}
                  onChange={(e) => setFilterNama(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </FilterCollapse>

          {/* MaterialReactTable */}
          <Box sx={{ pb: 4 }}>
            <MaterialReactTable table={table} key={showPermissionTable ? "permission-table" : ""} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
