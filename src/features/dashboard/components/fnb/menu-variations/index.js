"use client";

import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
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
  Stack,
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
import { Autosearch, useAutosearch } from "@/shared/ui/Autosearch";
import { fnbMenu, fnbMenuAddonGroupMap, fnbMenuCategory, fnbMenuVariant } from "@/core/services/api_fnb";
import { showErrorToast, toastPromise } from "@/shared/utils/toast";
import { formatCurrencyIDR } from "@/shared/utils/format";
import GeneralInformationSection from "./GeneralInformationSection";
import { pageContainerSx } from "./styles";

const PAGE_SIZE = 10;
const safeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value._id || value.id || "";
  return "";
};

const mapListItem = (item, categoriesMap = {}) => ({
  _id: safeId(item),
  name: item?.name || "-",
  categoryId: item?.categoryId || "",
  category: item?.categoryName || categoriesMap[item?.categoryId] || "-",
  price: item?.useVariant ? `Mulai ${formatCurrencyIDR(item?.minVariantPrice)}` : formatCurrencyIDR(item?.basePrice),
  useVariant: Boolean(item?.useVariant),
  status: item?.isActive ? "Active" : "Inactive",
  description: item?.description || "",
  imageUrl: item?.imageUrl || "",
  basePrice: item?.basePrice ?? 0,
  minVariantPrice: item?.minVariantPrice ?? 0,
  isAvailable: Boolean(item?.isAvailable),
  isActive: Boolean(item?.isActive),
});

function MenuDetailDialog({
  open,
  onClose,
  menu,
  categoryOptions,
  variants = [],
  variantLoading = false,
  addonGroups = [],
  addonItems = [],
  addonLoading = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ fontWeight: 800 }}>Detail Menu</DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#f8fafc" }}>
        {menu ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
              <GeneralInformationSection
                menuName={menu?.name || ""}
                category={menu?.categoryId || ""}
                basePrice={menu?.basePrice ?? 0}
                minVariantPrice={menu?.minVariantPrice ?? 0}
                statusChecked={Boolean(menu?.isAvailable)}
                useVariant={Boolean(menu?.useVariant)}
                description={menu?.description || ""}
                showAddonDetails={false}
                categoryOptions={categoryOptions}
                imagePreview={menu?.imageUrl || ""}
                readOnly
              />
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #e8edf3" }}>
              <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 1.5 }}>Add On Group</Typography>
              <Typography sx={{ color: "#111827", fontSize: "0.92rem", fontWeight: 600, mb: 1.25 }}>
                {addonGroups.map((group) => group?.name || group?._id || "-").join(", ") || "-"}
              </Typography>
              {addonLoading ? (
                <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>Memuat item add-on...</Typography>
              ) : addonItems.length ? (
                <Box sx={{ border: "1px solid #dbe3ef", borderRadius: 2, p: 1.25, bgcolor: "#f8fafc" }}>
                  <Stack spacing={1}>
                    {addonItems.map((item) => (
                      <Box
                        key={item?._id || item?.name}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          border: "1px solid #e5e7eb",
                          bgcolor: "#fff",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Typography sx={{ color: "#111827", fontSize: "0.86rem", fontWeight: 500 }}>
                          {item?.name || "-"}
                        </Typography>
                        <Typography sx={{ color: "#155DFC", fontSize: "0.86rem", fontWeight: 700 }}>
                          {formatCurrencyIDR(item?.price)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>Belum ada item add-on.</Typography>
              )}
            </Paper>

            {menu?.useVariant ? (
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #e8edf3" }}>
                <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 1.5 }}>Variants</Typography>
                {variantLoading ? (
                  <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>Memuat variant...</Typography>
                ) : variants.length ? (
                  <Stack spacing={1.25}>
                    {variants.map((variant, index) => (
                      <Paper
                        key={safeId(variant) || `variant-${index}`}
                        elevation={0}
                        sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8edf3", bgcolor: "#fff" }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start" }}>
                          <Box>
                            <Typography sx={{ color: "#111827", fontWeight: 700, fontSize: "0.92rem" }}>
                              {variant.name}
                            </Typography>
                            <Typography sx={{ color: "#6b7280", fontSize: "0.8rem", mt: 0.35 }}>
                              SKU: {variant.sku || "-"}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: "#155DFC", fontWeight: 800 }}>
                              {formatCurrencyIDR(variant.price)}
                            </Typography>
                            <Typography sx={{ color: "#6b7280", fontSize: "0.76rem", mt: 0.25 }}>
                              {variant.isDefault ? "Default" : "Optional"} - {variant.isAvailable ? "Aktif" : "Nonaktif"}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>
                    Belum ada variant untuk product ini.
                  </Typography>
                )}
              </Paper>
            ) : null}
          </Box>
        ) : (
          <Typography sx={{ color: "#6b7280" }}>Memuat detail menu...</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function FnbMenuVariationsPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = React.useState(false);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: PAGE_SIZE });
  const [sorting, setSorting] = React.useState([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [nameFilter, setNameFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, menu: null });
  const [listResponse, setListResponse] = React.useState(null);
  const [listError, setListError] = React.useState(null);
  const [listValidating, setListValidating] = React.useState(false);
  const [categoryLookup, setCategoryLookup] = React.useState({});
  const lastFetchKeyRef = React.useRef("");

  const categorySearch = useAutosearch(
    (params) => fnbMenuCategory.combo({ size: 10, ...params }),
    "fnb-menu-category"
  );

  React.useEffect(() => {
    if (!Array.isArray(categorySearch.options) || categorySearch.options.length === 0) return;
    setCategoryLookup((prev) => {
      const next = { ...prev };
      categorySearch.options.forEach((item) => {
        const id = safeId(item);
        if (!id) return;
        next[id] = item?.name || "-";
      });
      return next;
    });
  }, [categorySearch.options]);

  const categoryMap = React.useMemo(
    () => categoryLookup,
    [categoryLookup]
  );
  const selectedCategoryOption = React.useMemo(() => {
    const fromSearchOptions = (categorySearch.options || []).find((item) => safeId(item) === categoryFilter);
    if (fromSearchOptions) return fromSearchOptions;
    if (categoryFilter && categoryLookup[categoryFilter]) {
      return { _id: categoryFilter, name: categoryLookup[categoryFilter] };
    }
    return null;
  }, [categorySearch.options, categoryFilter, categoryLookup]);

  const categoryOptions = React.useMemo(
    () => Object.entries(categoryLookup).map(([value, label]) => ({ value, label })),
    [categoryLookup]
  );

  const hasActiveFilters = React.useMemo(
    () => Boolean(nameFilter || categoryFilter || statusFilter),
    [nameFilter, categoryFilter, statusFilter]
  );
  const statusOptions = React.useMemo(
    () => [
      { label: "Aktif", value: "true" },
      { label: "Tidak Aktif", value: "false" },
    ],
    []
  );

  const queryParams = React.useMemo(() => {
    const sortBy = sorting.length > 0 ? sorting[0].id : "name";
    const dir = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    return {
      size: pagination.pageSize,
      page: pagination.pageIndex + 1,
      sortby: sortBy,
      order: dir,
      name: nameFilter || undefined,
      categoryId: categoryFilter || undefined,
      isActive: statusFilter === "true" ? true : statusFilter === "false" ? false : undefined,
    };
  }, [pagination.pageSize, pagination.pageIndex, sorting, nameFilter, categoryFilter, statusFilter]);

  const fetchList = React.useCallback(async ({ force = false } = {}) => {
    const fetchKey = JSON.stringify(queryParams);
    if (!force && lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;

    setListValidating(true);
    setListError(null);
    try {
      const data = await fnbMenu.find(queryParams);
      setListResponse(data || null);
      if (typeof data?.data?.total === "number") {
        setRowCount(data.data.total);
      } else if (Array.isArray(data?.data?.items)) {
        setRowCount(data.data.items.length);
      } else {
        setRowCount(0);
      }
    } catch (error) {
      setListError(error);
    } finally {
      setListValidating(false);
    }
  }, [queryParams]);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  const listItems = React.useMemo(() => {
    if (Array.isArray(listResponse?.data?.items)) return listResponse.data.items;
    if (Array.isArray(listResponse?.items)) return listResponse.items;
    return [];
  }, [listResponse]);

  const tableData = React.useMemo(() => {
    return listItems.map((item, index) => ({
      ...mapListItem(item, categoryMap),
      index: index + pagination.pageIndex * pagination.pageSize + 1,
    }));
  }, [listItems, categoryMap, pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    if (!selectedMenu && tableData.length > 0) {
      setSelectedMenu(tableData[0]);
    }
  }, [tableData, selectedMenu]);

  const detailMenuId = safeId(selectedMenu) || null;

  const { data: detailResponse, error: detailError } = useSWR(
    detailOpen && detailMenuId ? ["fnb-menu-detail-table", detailMenuId] : null,
    () => fnbMenu.getById(detailMenuId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const detailMenu = detailResponse?.data || selectedMenu || null;

  const { data: variantResponse, error: variantError, isLoading: variantLoading } = useSWR(
    detailOpen && safeId(detailMenu) && detailMenu?.useVariant
      ? ["fnb-menu-variant-table", safeId(detailMenu)]
      : null,
    () =>
      fnbMenuVariant.find({
        menuId: safeId(detailMenu),
        size: 10,
        page: 1,
        order: "desc",
      }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const { data: addonGroupMapResponse, isLoading: addonGroupLoading } = useSWR(
    detailOpen && safeId(detailMenu) ? ["fnb-menu-addon-group-map-table", safeId(detailMenu)] : null,
    () => fnbMenuAddonGroupMap.findByMenu({ menuId: safeId(detailMenu) }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const detailAddonGroups = React.useMemo(() => {
    const raw = addonGroupMapResponse?.data?.items || addonGroupMapResponse?.data || addonGroupMapResponse?.items || [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
      .map((item) => {
        const firstDetailGroup = Array.isArray(item?.detailAddonGroup) ? item.detailAddonGroup[0] : null;
        const group =
          firstDetailGroup?.addonGroup ||
          item?.addonGroup ||
          item?.group ||
          null;
        const id = item?.addonGroupId || group?._id || (typeof item === "string" ? item : "");
        const name = group?.name || item?.addonGroupName || "";
        return id ? { _id: id, name } : null;
      })
      .filter(Boolean);
  }, [addonGroupMapResponse]);

  const detailAddonItems = React.useMemo(() => {
    const raw = addonGroupMapResponse?.data || [];
    const list = Array.isArray(raw) ? raw : [raw];
    const firstMap = list[0];
    const firstDetailGroup = Array.isArray(firstMap?.detailAddonGroup) ? firstMap.detailAddonGroup[0] : null;
    return firstDetailGroup?.addonItems || [];
  }, [addonGroupMapResponse]);

  const detailVariants = React.useMemo(
    () => (variantResponse?.data?.items || []).filter((variant) => Boolean(variant?._id)),
    [variantResponse]
  );

  React.useEffect(() => {
    if (categorySearch.error) {
      showErrorToast(categorySearch.error?.response?.data?.message || "Gagal memuat kategori menu.");
    }
  }, [categorySearch.error]);

  React.useEffect(() => {
    if (listError) {
      showErrorToast(listError?.response?.data?.message || "Gagal memuat product list.");
    }
  }, [listError]);

  React.useEffect(() => {
    if (detailError) {
      showErrorToast(detailError?.response?.data?.message || "Gagal memuat detail menu.");
    }
  }, [detailError]);

  React.useEffect(() => {
    if (variantError) {
      showErrorToast(variantError?.response?.data?.message || "Gagal memuat variant menu.");
    }
  }, [variantError]);

  const handleResetFilters = React.useCallback(() => {
    lastFetchKeyRef.current = "";
    setNameFilter("");
    setCategoryFilter("");
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

  const handleToggleFilters = React.useCallback((nextOpen) => {
    setShowFilters((prev) => (typeof nextOpen === "boolean" ? nextOpen : !prev));
  }, []);

  const handleView = React.useCallback((menu) => {
    setSelectedMenu(menu || null);
    setDetailOpen(true);
  }, []);

  const handleEdit = React.useCallback(
    (menu) => {
      const menuId = safeId(menu);
      if (!menuId) return;
      router.push(`/fnb/master-product/menu-variations/${menuId}/edit`);
    },
    [router]
  );

  const handleDelete = React.useCallback((menu) => {
    if (!safeId(menu)) return;
    setDeleteDialog({ open: true, menu });
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    const targetMenu = deleteDialog.menu;
    const targetMenuId = safeId(targetMenu);
    if (!targetMenuId) return;

    await toastPromise(fnbMenu.delete(targetMenuId), {
      loading: `Menghapus menu "${targetMenu.name}"...`,
      success: `Menu "${targetMenu.name}" berhasil dihapus.`,
      error: (error) => error?.response?.data?.message || "Gagal menghapus menu.",
    });

    await fetchList({ force: true });
    setDeleteDialog({ open: false, menu: null });
    if (safeId(selectedMenu) && safeId(selectedMenu) === targetMenuId) {
      setDetailOpen(false);
      setSelectedMenu(null);
    }
  }, [deleteDialog.menu, fetchList, selectedMenu]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "index",
        header: "NO",
        size: 40,
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
        accessorKey: "name",
        header: "NAMA MENU",
        Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography>,
      },
      {
        accessorKey: "category",
        header: "KATEGORI",
        Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography>,
      },
      {
        accessorKey: "price",
        header: "HARGA",
        Cell: ({ cell }) => <Typography variant="body2">{cell.getValue()}</Typography>,
      },
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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    getRowId: (row, index) => row?._id || `row-${index}`,
    rowCount,
    state: {
      isLoading: !listResponse && listValidating,
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
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "AKSI",
        muiTableHeadCellProps: { align: "left" },
      },
    },
    renderTopToolbar: () => (
      <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            columnGap: 1.5,
            rowGap: 1.5,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <FilterButton
              open={showFilters}
              onToggle={handleToggleFilters}
              hasActiveFilters={hasActiveFilters}
              onReset={handleResetFilters}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<Add size={20} color="white" />}
              onClick={() => router.push("/fnb/master-product/menu-variations/new")}
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
          containerSx={{
            p: 0,
            border: "none",
            backgroundColor: "transparent",
          }}
        >
          <Grid item xs={12} sm={6} md={2}>
            <DebouncedInput
              fullWidth
              size="small"
              placeholder="Cari nama menu..."
              value={nameFilter}
              onFilterChange={(value) => {
                lastFetchKeyRef.current = "";
                setNameFilter(value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 280 }}>
            <Autosearch
              value={selectedCategoryOption}
              options={categorySearch.options}
              loading={categorySearch.loading}
              open={categorySearch.open}
              onOpen={categorySearch.onOpen}
              onClose={categorySearch.onClose}
              onInputChange={categorySearch.onInputChange}
              onChange={(_, selectedValue) => {
                lastFetchKeyRef.current = "";
                setCategoryFilter(safeId(selectedValue) || "");
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              placeholder="Kategori"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 260 }}>
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
              renderInput={(params) => <TextField {...params} placeholder="Status" />}
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
    muiTableBodyCellProps: {
      sx: { fontSize: "12px !important" },
    },
    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(even)": {
          backgroundColor: "rgba(248, 249, 250, 1) !important",
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 0,
        boxShadow: "none",
        border: "none",
      },
    },
    mrtTheme: {
      baseBackgroundColor: "rgba(255, 255, 255, 1)",
    },
    renderRowActions: ({ row }) => (
      <Box display="flex" gap={0.5}>
        <Tooltip title="Detail" arrow>
          <IconButton size="small" onClick={() => handleView(row.original)} sx={{ color: "#1976d2" }}>
            <Eye size={20} color="#1976d2" variant="Linear" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <IconButton size="small" onClick={() => handleEdit(row.original)} sx={{ color: "#ed6c02" }}>
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
  });

  return (
    <Box sx={pageContainerSx}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
        <MaterialReactTable table={table} />
      </Paper>

      <MenuDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        menu={detailMenu}
        categoryOptions={categoryOptions}
        variants={detailVariants}
        variantLoading={variantLoading}
        addonGroups={detailAddonGroups}
        addonItems={detailAddonItems}
        addonLoading={addonGroupLoading}
      />

      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, menu: null })}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus <strong>{deleteDialog.menu?.name}</strong>?
          </Typography>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Box>
  );
}
