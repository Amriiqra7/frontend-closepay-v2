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
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Edit, Eye } from "iconsax-react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import FilterCollapse, { FilterButton } from "@/shared/ui/FilterCollapse";
import TablePagination from "@/shared/ui/TablePagination";
import DebouncedInput from "@/shared/ui/DebouncedInput";
import { fnbMerchantKiosk } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";
import { pageContainerSx } from "../menu-variations/styles";
import KioskDetailDialog from "./KioskDetailDialog";

const PAGE_SIZE = 10;

const safeId = (value) => (typeof value === "string" ? value : value?.id || value?._id || "");

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapRow = (item) => ({
  _id: safeId(item),
  deviceCode: item?.deviceCode || "-",
  deviceName: item?.deviceName || "-",
  deviceType: item?.deviceType || "-",
  isActive: Boolean(item?.isActive),
  status: item?.isActive ? "Active" : "Inactive",
  apiKeyLastRotatedAt: item?.apiKeyLastRotatedAt || "",
  apiKeyLastUsedAt: item?.apiKeyLastUsedAt || "",
});

export default function KioskList() {
  const router = useRouter();
  const [showFilters, setShowFilters] = React.useState(false);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: PAGE_SIZE });
  const [sorting, setSorting] = React.useState([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [keywordFilter, setKeywordFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [listResponse, setListResponse] = React.useState(null);
  const [listError, setListError] = React.useState(null);
  const [listValidating, setListValidating] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [switchLoadingById, setSwitchLoadingById] = React.useState({});
  const [confirmToggle, setConfirmToggle] = React.useState({ open: false, row: null, nextActive: false });
  const lastFetchKeyRef = React.useRef("");

  const hasActiveFilters = React.useMemo(() => Boolean(keywordFilter || statusFilter), [keywordFilter, statusFilter]);
  const statusOptions = React.useMemo(() => [{ label: "Aktif", value: "true" }, { label: "Tidak Aktif", value: "false" }], []);

  const queryParams = React.useMemo(() => {
    const sortBy = sorting.length > 0 ? sorting[0].id : "createdTime";
    const dir = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    return {
      size: pagination.pageSize,
      page: pagination.pageIndex + 1,
      sortby: sortBy,
      order: dir,
      keyword: keywordFilter || undefined,
      isActive: statusFilter === "true" ? true : statusFilter === "false" ? false : undefined,
    };
  }, [pagination.pageIndex, pagination.pageSize, sorting, keywordFilter, statusFilter]);

  const fetchList = React.useCallback(async ({ force = false } = {}) => {
    const fetchKey = JSON.stringify(queryParams);
    if (!force && lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;

    setListValidating(true);
    setListError(null);
    try {
      const data = await fnbMerchantKiosk.find(queryParams);
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
    if (listError) showErrorToast(getApiErrorMessage(listError, "Gagal memuat data kiosk."));
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
    detailOpen && detailId ? ["fnb-kiosk-detail", detailId] : null,
    () => fnbMerchantKiosk.getById(detailId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  React.useEffect(() => {
    if (detailError) showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail kiosk."));
  }, [detailError]);

  const detailData = detailResponse?.data || selectedRow || null;

  const handleConfirmToggleActive = React.useCallback(
    async (row) => {
      const kioskId = safeId(row);
      if (!kioskId) return;
      const currentActive = Boolean(row?.isActive);

      setSwitchLoadingById((prev) => ({ ...prev, [kioskId]: true }));
      try {
        await toastPromise(
          currentActive ? fnbMerchantKiosk.revoke(kioskId) : fnbMerchantKiosk.activate(kioskId),
          {
            loading: currentActive ? "Menonaktifkan kiosk..." : "Mengaktifkan kiosk...",
            success: currentActive ? "Kiosk berhasil dinonaktifkan." : "Kiosk berhasil diaktifkan.",
            error: (error) =>
              getApiErrorMessage(
                error,
                currentActive ? "Gagal menonaktifkan kiosk." : "Gagal mengaktifkan kiosk."
              ),
          }
        );
        await fetchList({ force: true });
      } finally {
        setSwitchLoadingById((prev) => ({ ...prev, [kioskId]: false }));
      }
    },
    [fetchList]
  );

  const columns = React.useMemo(() => [
    { accessorKey: "index", header: "NO", size: 40, enableSorting: false, muiTableHeadCellProps: { align: "center" }, muiTableBodyCellProps: { align: "center" } },
    { accessorKey: "deviceCode", header: "DEVICE CODE", Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography> },
    { accessorKey: "deviceName", header: "NAMA KIOSK", Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography> },
    { accessorKey: "deviceType", header: "TYPE", size: 120, Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography> },
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
  ], [handleConfirmToggleActive, switchLoadingById]);

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
              onToggle={(nextOpen) => setShowFilters((prev) => (typeof nextOpen === "boolean" ? nextOpen : !prev))}
              hasActiveFilters={hasActiveFilters}
              onReset={() => {
                lastFetchKeyRef.current = "";
                setKeywordFilter("");
                setStatusFilter("");
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
          </Box>
          <Button variant="contained" startIcon={<Add size={20} color="white" />} onClick={() => router.push("/fnb/master-product/manajemen-kiosk/new")} sx={{ textTransform: "none", height: "40px", px: 2 }}>
            Tambah
          </Button>
        </Box>
        <FilterCollapse open={showFilters} onToggle={(nextOpen) => setShowFilters((prev) => (typeof nextOpen === "boolean" ? nextOpen : !prev))} hasActiveFilters={hasActiveFilters} onReset={() => {
          lastFetchKeyRef.current = "";
          setKeywordFilter("");
          setStatusFilter("");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }} showLabel={false} hideHeader containerSx={{ p: 0, border: "none", backgroundColor: "transparent" }}>
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 280 }}>
            <DebouncedInput fullWidth size="small" placeholder="Cari nama/kode kiosk..." value={keywordFilter} onFilterChange={(value) => { lastFetchKeyRef.current = ""; setKeywordFilter(value); setPagination((prev) => ({ ...prev, pageIndex: 0 })); }} />
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
        "& .MuiTableSortLabel-icon, & .MuiIconButton-root, & .MuiBadge-root": { opacity: 0, transition: "opacity 0.2s ease-in-out" },
        "&:hover .MuiTableSortLabel-icon, &:hover .MuiIconButton-root, &:hover .MuiBadge-root": { opacity: 1 },
        "& .MuiTableSortLabel-active .MuiTableSortLabel-icon": { opacity: 1 },
        "& .Mui-TableHeadCell-Content-Labels .Mui-TableHeadCell-Content-Wrapper": { opacity: 1 },
      },
    },
    muiTableBodyCellProps: { sx: { fontSize: "12px !important" } },
    muiTableBodyProps: { sx: { "& tr:nth-of-type(even)": { backgroundColor: "rgba(248, 249, 250, 1) !important" } } },
    muiTablePaperProps: { elevation: 0, sx: { borderRadius: 0, boxShadow: "none", border: "none" } },
    mrtTheme: { baseBackgroundColor: "rgba(255, 255, 255, 1)" },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Tooltip title={row.original?.isActive ? "Nonaktifkan" : "Aktifkan"} arrow>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Switch
              size="small"
              checked={Boolean(row.original?.isActive)}
              disabled={Boolean(switchLoadingById[safeId(row.original)])}
              onChange={(_, checked) => {
                setConfirmToggle({ open: true, row: row.original, nextActive: checked });
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#155DFC" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#155DFC",
                },
              }}
            />
          </Box>
        </Tooltip>
        <Tooltip title="Detail" arrow><IconButton size="small" onClick={() => { setSelectedRow(row.original); setDetailOpen(true); }}><Eye size={20} color="#1976d2" variant="Linear" /></IconButton></Tooltip>
        <Tooltip title="Edit" arrow><IconButton size="small" onClick={() => router.push(`/fnb/master-product/manajemen-kiosk/${safeId(row.original)}/edit`)}><Edit size={20} color="#ed6c02" variant="Linear" /></IconButton></Tooltip>
      </Box>
    ),
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={rowCount}
        onPageChange={(newPageIndex) => { lastFetchKeyRef.current = ""; setPagination((prev) => ({ ...prev, pageIndex: newPageIndex })); }}
        onPageSizeChange={(newPageSize) => { lastFetchKeyRef.current = ""; setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 })); }}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    ),
  });

  return (
    <Box sx={pageContainerSx}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
        <MaterialReactTable table={table} />
      </Paper>

      <KioskDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)} data={detailData} loading={detailLoading} />
      <Dialog
        open={confirmToggle.open}
        onClose={() => setConfirmToggle({ open: false, row: null, nextActive: false })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Konfirmasi Status Kiosk
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "0.9rem", color: "#374151" }}>
            {confirmToggle.nextActive
              ? "Yakin ingin mengaktifkan kiosk ini?"
              : "Yakin ingin menonaktifkan kiosk ini?"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmToggle({ open: false, row: null, nextActive: false })}
            sx={{ textTransform: "none" }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              const row = confirmToggle.row;
              setConfirmToggle({ open: false, row: null, nextActive: false });
              if (row) await handleConfirmToggleActive(row);
            }}
            sx={{ textTransform: "none" }}
          >
            Ya, Lanjutkan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
