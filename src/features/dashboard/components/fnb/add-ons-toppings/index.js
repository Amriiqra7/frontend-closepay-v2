"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Edit, Eye, Trash } from "iconsax-react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import FilterCollapse, { FilterButton } from "@/shared/ui/FilterCollapse";
import AlertDialog from "@/shared/ui/AlertDialog";
import TablePagination from "@/shared/ui/TablePagination";
import DebouncedInput from "@/shared/ui/DebouncedInput";
import { showErrorToast, toastPromise } from "@/shared/utils/toast";
import { formatCurrencyIDR } from "@/shared/utils/format";
import { fnbMenuAddonGroup, fnbMenuAddonItem } from "@/core/services/api_fnb";
import { pageContainerSx } from "../menu-variations/styles";

const PAGE_SIZE = 10;

const safeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value._id || value.id || "";
  return "";
};

const mapRow = (item) => ({
  _id: safeId(item),
  name: item?.name || "-",
  description: item?.description || "",
  selectionType: item?.selectionType || "-",
  minSelection: item?.minSelection ?? 0,
  maxSelection: item?.maxSelection ?? 0,
  isRequired: Boolean(item?.isRequired),
  isActive: Boolean(item?.isActive),
  status: item?.isActive ? "Active" : "Inactive",
});

function AddOnGroupDetailDialog({ open, onClose, data, groupId }) {
  const readOnlyInputSx = {
    "& .MuiInputBase-input": {
      fontSize: "0.8125rem",
      py: 1,
    },
  };

  const { data: itemListResponse, isLoading: itemLoading, error: itemError } = useSWR(
    open && groupId ? ["fnb-addon-item-list", groupId] : null,
    () =>
      fnbMenuAddonItem.find({
        groupId,
        size: 10,
        page: 1,
        order: "asc",
      }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const itemDetails = React.useMemo(
    () =>
      (Array.isArray(itemListResponse?.data?.items) ? itemListResponse.data.items : []).map((item, index) => ({
        _id: item?._id || `${groupId}-${index}`,
        name: item?.name || "-",
        price: item?.price ?? 0,
        isAvailable: Boolean(item?.isAvailable),
        isDefault: Boolean(item?.isDefault),
      })),
    [itemListResponse, groupId]
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ px: 3, py: 1.5, fontWeight: 500, fontSize: "1rem" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "#1f2937" }}>Information</Typography>
          <Button
            onClick={onClose}
            sx={{
              minWidth: 32,
              px: 1,
              color: "#64748b",
              fontSize: "1.5rem",
              lineHeight: 1,
              "&:hover": { bgcolor: "transparent", color: "#334155" },
            }}
          >
            ×
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, py: 3 }}>
        {data ? (
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Group Name</Typography>
                <TextField fullWidth size="small" value={data.name || "-"} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
              </Box>
              <Box>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Selection Type</Typography>
                <TextField fullWidth size="small" value={data.selectionType || "-"} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
              </Box>
              <Box>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Min Selection</Typography>
                <TextField fullWidth size="small" value={String(data.minSelection ?? 0)} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
              </Box>
              <Box>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Max Selection</Typography>
                <TextField fullWidth size="small" value={String(data.maxSelection ?? 0)} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
              </Box>
              <Box>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Status</Typography>
                <TextField fullWidth size="small" value={data.isActive ? "Aktif" : "Tidak Aktif"} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
              </Box>
              <Box>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Required</Typography>
                <TextField fullWidth size="small" value={data.isRequired ? "Yes" : "No"} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
              </Box>
              <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
                <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Description</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={data.description || "-"}
                  InputProps={{ readOnly: true }}
                  sx={readOnlyInputSx}
                />
              </Box>
            </Box>

            <Box sx={{ pt: 1 }}>
              <Typography sx={{ color: "#64748b", mb: 0.75, fontSize: "0.8125rem" }}>List Item</Typography>
              {itemLoading ? (
                <Typography sx={{ color: "#6b7280" }}>Memuat list item...</Typography>
              ) : itemError ? (
                <Typography sx={{ color: "#b91c1c" }}>Gagal memuat list item.</Typography>
              ) : itemDetails.length > 0 ? (
                <Box sx={{ display: "grid", gap: 0.9 }}>
                  {itemDetails.map((item, index) => (
                    <Box
                      key={item._id || index}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                        gap: 1,
                        alignItems: "center",
                        p: 1.15,
                        border: "1px solid #e2e8f0",
                        borderRadius: 1.5,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontSize: "0.8125rem",
                            lineHeight: 1.35,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography sx={{ color: "#334155", fontSize: "0.75rem", lineHeight: 1.3 }}>
                          {formatCurrencyIDR(item.price)}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={item.isAvailable ? "Aktif" : "Nonaktif"}
                        sx={{
                          justifySelf: { xs: "start", md: "end" },
                          height: 22,
                          fontSize: "0.6875rem",
                          bgcolor: item.isAvailable ? "#dcfce7" : "#e2e8f0",
                          color: item.isAvailable ? "#166534" : "#475569",
                          border: "none",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: "#6b7280" }}>Tidak ada data list item.</Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: "#6b7280" }}>Memuat detail...</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#e5e7eb",
            color: "#111827",
            boxShadow: "none",
            textTransform: "none",
            "&:hover": { bgcolor: "#d1d5db", boxShadow: "none" },
          }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function FnbAddOnsToppingsPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = React.useState(false);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: PAGE_SIZE });
  const [sorting, setSorting] = React.useState([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [nameFilter, setNameFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [listResponse, setListResponse] = React.useState(null);
  const [listError, setListError] = React.useState(null);
  const [listValidating, setListValidating] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, row: null });
  const lastFetchKeyRef = React.useRef("");

  const hasActiveFilters = React.useMemo(() => Boolean(nameFilter || statusFilter), [nameFilter, statusFilter]);

  const statusOptions = React.useMemo(
    () => [
      { label: "Aktif", value: "true" },
      { label: "Tidak Aktif", value: "false" },
    ],
    []
  );

  const queryParams = React.useMemo(() => {
    const sortBy = sorting.length > 0 ? sorting[0].id : "createdTime";
    const dir = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "asc";
    return {
      size: pagination.pageSize,
      page: pagination.pageIndex + 1,
      sortby: sortBy,
      order: dir,
      name: nameFilter || undefined,
      isActive: statusFilter === "true" ? true : statusFilter === "false" ? false : undefined,
    };
  }, [pagination.pageSize, pagination.pageIndex, sorting, nameFilter, statusFilter]);

  const fetchList = React.useCallback(
    async ({ force = false } = {}) => {
      const fetchKey = JSON.stringify(queryParams);
      if (!force && lastFetchKeyRef.current === fetchKey) return;
      lastFetchKeyRef.current = fetchKey;

      setListValidating(true);
      setListError(null);
      try {
        const data = await fnbMenuAddonGroup.find(queryParams);
        setListResponse(data || null);
        setRowCount(typeof data?.data?.total === "number" ? data.data.total : Array.isArray(data?.data?.items) ? data.data.items.length : 0);
      } catch (error) {
        setListError(error);
      } finally {
        setListValidating(false);
      }
    },
    [queryParams]
  );

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  const tableData = React.useMemo(
    () => (Array.isArray(listResponse?.data?.items) ? listResponse.data.items : []).map((item, index) => ({
      ...mapRow(item),
      index: index + pagination.pageIndex * pagination.pageSize + 1,
    })),
    [listResponse, pagination.pageIndex, pagination.pageSize]
  );

  const detailId = safeId(selectedRow) || null;
  const { data: detailResponse, error: detailError } = useSWR(
    detailOpen && detailId ? ["fnb-addon-group-detail", detailId] : null,
    () => fnbMenuAddonGroup.getById(detailId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const detailData = detailResponse?.data || selectedRow || null;

  React.useEffect(() => {
    if (listError) showErrorToast(listError?.response?.data?.message || "Gagal memuat add-on group.");
  }, [listError]);

  React.useEffect(() => {
    if (detailError) showErrorToast(detailError?.response?.data?.message || "Gagal memuat detail add-on group.");
  }, [detailError]);

  const handleToggleFilters = React.useCallback((nextOpen) => {
    setShowFilters((prev) => (typeof nextOpen === "boolean" ? nextOpen : !prev));
  }, []);

  const handleResetFilters = React.useCallback(() => {
    lastFetchKeyRef.current = "";
    setNameFilter("");
    setStatusFilter("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePageChange = React.useCallback((newPageIndex) => {
    lastFetchKeyRef.current = "";
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = React.useCallback((newPageSize) => {
    lastFetchKeyRef.current = "";
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  const handleDelete = React.useCallback((row) => {
    if (!safeId(row)) return;
    setDeleteDialog({ open: true, row });
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    const target = deleteDialog.row;
    const targetId = safeId(target);
    if (!targetId) return;

    await toastPromise(fnbMenuAddonGroup.delete(targetId), {
      loading: `Menghapus add-on group "${target.name}"...`,
      success: `Add-on group "${target.name}" berhasil dihapus.`,
      error: (error) => error?.response?.data?.message || "Gagal menghapus add-on group.",
    });

    await fetchList({ force: true });
    setDeleteDialog({ open: false, row: null });
    if (safeId(selectedRow) === targetId) {
      setDetailOpen(false);
      setSelectedRow(null);
    }
  }, [deleteDialog.row, fetchList, selectedRow]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "index",
        header: "NO",
        size: 40,
        enableSorting: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <Typography variant="body2" align="center">{cell.getValue()}</Typography>,
      },
      {
        accessorKey: "name",
        header: "NAMA GROUP",
        Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography>,
      },
      {
        accessorKey: "selectionType",
        header: "TYPE",
        Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography>,
      },
      {
        accessorKey: "status",
        header: "STATUS",
        size: 120,
        Cell: ({ cell }) => {
          const active = cell.getValue() === "Active";
          return (
            <Chip
              label={active ? "Aktif" : "Tidak Aktif"}
              size="small"
              sx={{
                bgcolor: active ? "#d1fae5" : "#fee2e2",
                color: active ? "#065f46" : "#991b1b",
                fontWeight: 700,
                fontSize: "0.75rem",
                height: 24,
                border: "none",
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
    data: tableData,
    getRowId: (row, index) => row?._id || `row-${index}`,
    rowCount,
    state: {
      isLoading: false,
      pagination,
      showAlertBanner: !!listError,
      showProgressBars: listValidating && !listError,
      sorting,
    },
    initialState: { density: "compact" },
    enableRowActions: true,
    enableSorting: true,
    enablePagination: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableTopToolbar: false,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: false,
    positionActionsColumn: "last",
    onSortingChange: (updater) => {
      lastFetchKeyRef.current = "";
      setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "AKSI",
        muiTableHeadCellProps: { align: "left" },
      },
    },
    renderRowActions: ({ row }) => (
      <Box display="flex" gap={0.5}>
        <Tooltip title="Detail" arrow>
          <IconButton size="small" onClick={() => { setSelectedRow(row.original); setDetailOpen(true); }} sx={{ color: "#1976d2" }}>
            <Eye size={20} color="#1976d2" variant="Linear" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <IconButton size="small" onClick={() => router.push(`/fnb/master-product/add-ons-toppings/${safeId(row.original)}/edit`)} sx={{ color: "#ed6c02" }}>
            <Edit size={20} color="#ed6c02" variant="Linear" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus" arrow>
          <IconButton size="small" onClick={() => handleDelete(row.original)} sx={{ color: "#d32f2f" }}>
            <Trash size={20} color="#d32f2f" variant="Linear" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={rowCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    ),
    muiTableHeadCellProps: {
      sx: {
        fontSize: "12px !important",
        fontWeight: "600 !important",
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
        "& .Mui-TableHeadCell-Content-Labels .Mui-TableHeadCell-Content-Wrapper": {
          opacity: 1,
        },
      },
    },
    muiTableBodyCellProps: { sx: { fontSize: "12px !important" } },
    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(even)": {
          backgroundColor: "rgba(248, 249, 250, 1) !important",
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: 0, boxShadow: "none", border: "none" },
    },
    mrtTheme: {
      baseBackgroundColor: "rgba(255, 255, 255, 1)",
    },
  });

  return (
    <Box sx={pageContainerSx}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 1.5, rowGap: 1.5 }}>
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <FilterButton
                open={showFilters}
                onToggle={handleToggleFilters}
                hasActiveFilters={hasActiveFilters}
                onReset={handleResetFilters}
              />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
              <Button
                variant="contained"
                startIcon={<Add size={20} color="white" />}
                onClick={() => router.push("/fnb/master-product/add-ons-toppings/new")}
                sx={{ textTransform: "none", height: "40px", px: 2 }}
              >
                Tambah
              </Button>
            </Box>
          </Box>

          <FilterCollapse
            open={showFilters}
            onToggle={handleToggleFilters}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
            buttonText="Filters"
            showLabel={false}
            hideHeader
            containerSx={{ p: 0, border: "none", backgroundColor: "transparent" }}
          >
            <Grid item xs={12} sm={6} md={6} sx={{ minWidth: 280 }}>
              <DebouncedInput
                fullWidth
                size="small"
                placeholder="Cari nama group..."
                value={nameFilter}
                onFilterChange={(value) => {
                  lastFetchKeyRef.current = "";
                  setNameFilter(value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{ minWidth: 280 }}>
              <Autocomplete
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: 40,
                    height: 40,
                    paddingRight: "14px !important",
                  },
                  "& .MuiInputBase-input": {
                    padding: "8.5px 0",
                  },
                }}
                options={statusOptions}
                value={statusOptions.find((option) => option.value === statusFilter) || null}
                isOptionEqualToValue={(option, val) => option.value === val.value}
                getOptionLabel={(option) => option?.label || ""}
                onChange={(_, selectedOption) => {
                  lastFetchKeyRef.current = "";
                  setStatusFilter(selectedOption?.value || "");
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                renderInput={(params) => <TextField {...params} placeholder="Filter status" />}
              />
            </Grid>
          </FilterCollapse>

          <Box sx={{ mt: 1.5 }}>
            <MaterialReactTable table={table} />
          </Box>
        </Box>
      </Paper>

      <AddOnGroupDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={detailData}
        groupId={detailId}
      />

      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, row: null })}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus <strong>{deleteDialog.row?.name}</strong>?
          </Typography>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Box>
  );
}
