"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
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
import { fnbMenuCategory } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";
import { pageContainerSx } from "../menu-variations/styles";
import CategoryDetailDialog from "./CategoryDetailDialog";

const PAGE_SIZE = 10;
const safeId = (value) => (typeof value === "string" ? value : value?.id || value?._id || "");

const mapRow = (item) => ({
  _id: safeId(item),
  name: item?.name || "-",
  description: item?.description || "",
  sortOrder: item?.sortOrder ?? 0,
  isActive: Boolean(item?.isActive),
  status: item?.isActive ? "Active" : "Inactive",
});

export default function CategoryList() {
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
  const statusOptions = React.useMemo(() => [{ label: "Aktif", value: "true" }, { label: "Tidak Aktif", value: "false" }], []);
  const handleToggleFilters = React.useCallback((nextOpen) => {
    setShowFilters((prev) => (typeof nextOpen === "boolean" ? nextOpen : !prev));
  }, []);
  const handleResetFilters = React.useCallback(() => {
    lastFetchKeyRef.current = "";
    setNameFilter("");
    setStatusFilter("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const queryParams = React.useMemo(() => {
    const sortBy = sorting.length > 0 ? sorting[0].id : "createdTime";
    const dir = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    return {
      size: pagination.pageSize,
      page: pagination.pageIndex + 1,
      sortby: sortBy,
      order: dir,
      name: nameFilter || undefined,
      isActive: statusFilter === "true" ? true : statusFilter === "false" ? false : undefined,
    };
  }, [pagination.pageIndex, pagination.pageSize, sorting, nameFilter, statusFilter]);

  const fetchList = React.useCallback(async ({ force = false } = {}) => {
    const fetchKey = JSON.stringify(queryParams);
    if (!force && lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;

    setListValidating(true);
    setListError(null);
    try {
      const data = await fnbMenuCategory.find(queryParams);
      setListResponse(data || null);
      setRowCount(typeof data?.data?.total === "number" ? data.data.total : 0);
    } catch (error) {
      setListError(error);
    } finally {
      setListValidating(false);
    }
  }, [queryParams]);

  React.useEffect(() => { fetchList(); }, [fetchList]);
  React.useEffect(() => {
    if (listError) showErrorToast(getApiErrorMessage(listError, "Gagal memuat kategori."));
  }, [listError]);

  const tableData = React.useMemo(
    () => (Array.isArray(listResponse?.data?.items) ? listResponse.data.items : []).map((item, index) => ({
      ...mapRow(item),
      index: index + pagination.pageIndex * pagination.pageSize + 1,
    })),
    [listResponse, pagination.pageIndex, pagination.pageSize]
  );

  const detailId = safeId(selectedRow) || null;
  const { data: detailResponse, error: detailError, isLoading: detailLoading } = useSWR(
    detailOpen && detailId ? ["fnb-category-detail", detailId] : null,
    () => fnbMenuCategory.getById(detailId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    if (detailError) showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail kategori."));
  }, [detailError]);

  const detailData = detailResponse?.data || selectedRow || null;

  const handleConfirmDelete = React.useCallback(async () => {
    const target = deleteDialog.row;
    const targetId = safeId(target);
    if (!targetId) return;

    await toastPromise(fnbMenuCategory.delete(targetId), {
      loading: `Menghapus kategori "${target?.name}"...`,
      success: `Kategori "${target?.name}" berhasil dihapus.`,
      error: (error) => getApiErrorMessage(error, "Gagal menghapus kategori."),
    });

    await fetchList({ force: true });
    setDeleteDialog({ open: false, row: null });
  }, [deleteDialog.row, fetchList]);

  const columns = React.useMemo(() => [
    { accessorKey: "index", header: "NO", size: 40, enableSorting: false, muiTableHeadCellProps: { align: "center" }, muiTableBodyCellProps: { align: "center" } },
    { accessorKey: "name", header: "NAMA KATEGORI", Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography> },
    { accessorKey: "description", header: "DESKRIPSI", Cell: ({ cell }) => <Typography variant="body2">{cell.getValue() || "-"}</Typography> },
    { accessorKey: "sortOrder", header: "URUTAN", size: 100, Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography> },
    {
      accessorKey: "status",
      header: "STATUS",
      size: 120,
      Cell: ({ cell }) => {
        const isActive = cell.getValue() === "Active";
        return (
          <Chip
            label={isActive ? "Aktif" : "Tidak Aktif"}
            size="small"
            sx={{
              bgcolor: isActive ? "#d1fae5" : "#fee2e2",
              color: isActive ? "#065f46" : "#991b1b",
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 24,
              border: "none",
            }}
          />
        );
      },
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    getRowId: (row, index) => row?._id || `row-${index}`,
    rowCount,
    state: { isLoading: !listResponse && listValidating, pagination, showAlertBanner: !!listError, showProgressBars: listValidating && !listError, sorting },
    initialState: { density: "compact" },
    enableRowActions: true,
    enableSorting: true,
    enablePagination: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableTopToolbar: true,
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
    displayColumnDefOptions: { "mrt-row-actions": { header: "AKSI", muiTableHeadCellProps: { align: "left" } } },
    renderTopToolbar: () => (
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
          <Button variant="contained" startIcon={<Add size={20} color="white" />} onClick={() => router.push("/fnb/master-product/category/new")} sx={{ textTransform: "none", height: "40px", px: 2 }}>
            Tambah
          </Button>
        </Box>
        <FilterCollapse open={showFilters} onToggle={handleToggleFilters} hasActiveFilters={hasActiveFilters} onReset={handleResetFilters} showLabel={false} hideHeader containerSx={{ p: 0, border: "none", backgroundColor: "transparent" }}>
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 280 }}>
            <DebouncedInput fullWidth size="small" placeholder="Cari category..." value={nameFilter} onFilterChange={(value) => { lastFetchKeyRef.current = ""; setNameFilter(value); setPagination((prev) => ({ ...prev, pageIndex: 0 })); }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 260 }}>
            <Autocomplete
              fullWidth
              size="small"
              sx={{ "& .MuiInputBase-root": { minHeight: 40, height: 40, paddingRight: "14px !important" }, "& .MuiInputBase-input": { padding: "8.5px 0" } }}
              options={statusOptions}
              value={statusOptions.find((option) => option.value === statusFilter) || null}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              getOptionLabel={(option) => option?.label || ""}
              onChange={(_, selectedOption) => { lastFetchKeyRef.current = ""; setStatusFilter(selectedOption?.value || ""); setPagination((prev) => ({ ...prev, pageIndex: 0 })); }}
              renderInput={(params) => <TextField {...params} placeholder="Filter status" />}
            />
          </Grid>
        </FilterCollapse>
      </Box>
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
    muiTableBodyProps: { sx: { "& tr:nth-of-type(even)": { backgroundColor: "rgba(248, 249, 250, 1) !important" } } },
    muiTablePaperProps: { elevation: 0, sx: { borderRadius: 0, boxShadow: "none", border: "none" } },
    mrtTheme: { baseBackgroundColor: "rgba(255, 255, 255, 1)" },
    renderRowActions: ({ row }) => (
      <Box display="flex" gap={0.5}>
        <Tooltip title="Detail" arrow><IconButton size="small" onClick={() => { setSelectedRow(row.original); setDetailOpen(true); }}><Eye size={20} color="#1976d2" variant="Linear" /></IconButton></Tooltip>
        <Tooltip title="Edit" arrow><IconButton size="small" onClick={() => router.push(`/fnb/master-product/category/${safeId(row.original)}/edit`)}><Edit size={20} color="#ed6c02" variant="Linear" /></IconButton></Tooltip>
        <Tooltip title="Hapus" arrow><IconButton size="small" onClick={() => setDeleteDialog({ open: true, row: row.original })}><Trash size={20} color="#d32f2f" variant="Linear" /></IconButton></Tooltip>
      </Box>
    ),
    renderBottomToolbar: () => <TablePagination pageIndex={pagination.pageIndex} pageSize={pagination.pageSize} rowCount={rowCount} onPageChange={(newPageIndex) => { lastFetchKeyRef.current = ""; setPagination((prev) => ({ ...prev, pageIndex: newPageIndex })); }} onPageSizeChange={(newPageSize) => { lastFetchKeyRef.current = ""; setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 })); }} pageSizeOptions={[10, 25, 50, 100]} />,
  });

  return (
    <Box sx={pageContainerSx}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
        <MaterialReactTable table={table} />
      </Paper>

      <CategoryDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)} data={detailData} loading={detailLoading} />

      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, row: null })}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        content={<Typography variant="body1">Apakah anda yakin akan menghapus <strong>{deleteDialog.row?.name}</strong>?</Typography>}
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Box>
  );
}
