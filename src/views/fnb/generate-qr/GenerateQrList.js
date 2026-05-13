"use client";

import React from "react";
import useSWR from "swr";
import { QRCode } from "antd";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Eye, Trash } from "iconsax-react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { fnbMerchantTable } from "@/core/services/api_fnb";
import AlertDialog from "@/shared/ui/AlertDialog";
import { getApiErrorMessage, showErrorToast, showSuccessToast, toastPromise } from "@/shared/utils/toast";
import GenerateQrFormDialog from "./GenerateQrFormDialog";
import GenerateQrDetailDialog from "./GenerateQrDetailDialog";
import QrPreviewDialog from "./QrPreviewDialog";

const pageContainerSx = { display: "flex", flexDirection: "column", gap: 3 };

const toList = (response) => {
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

export default function FnbGenerateQrPage() {
  const [sorting, setSorting] = React.useState([]);

  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [totalTable, setTotalTable] = React.useState("1");
  const [submittingGenerate, setSubmittingGenerate] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detailData, setDetailData] = React.useState(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewQrValue, setPreviewQrValue] = React.useState("");
  const [previewTableNumber, setPreviewTableNumber] = React.useState("");
  const [generatedRows, setGeneratedRows] = React.useState([]);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, row: null });

  const {
    data: listResponse,
    error: listError,
    isLoading: listLoading,
    mutate: mutateList,
  } = useSWR("fnb-merchant-table-list", () => fnbMerchantTable.find({}), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  React.useEffect(() => {
    if (listError) {
      showErrorToast(getApiErrorMessage(listError, "Gagal memuat data meja."));
    }
  }, [listError]);

  const tableData = React.useMemo(() => toList(listResponse), [listResponse]);

  const handleOpenDetail = React.useCallback(async (row) => {
    if (!row?._id) return;
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const response = await fnbMerchantTable.getById(row._id);
      setDetailData(response?.data?.data || response?.data || null);
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Gagal memuat detail meja."));
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleGenerate = React.useCallback(async () => {
    const parsedTotalTable = Number(totalTable);
    if (!Number.isInteger(parsedTotalTable) || parsedTotalTable <= 0) {
      showErrorToast("Nomor meja harus berupa angka bulat lebih dari 0.");
      return;
    }

    setSubmittingGenerate(true);
    try {
      const response = await fnbMerchantTable.generate({ totalTable: parsedTotalTable });
      setGeneratedRows(toList(response));
      showSuccessToast("QR meja berhasil digenerate.");
      setTotalTable("1");
      await mutateList();
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Gagal generate QR meja."));
    } finally {
      setSubmittingGenerate(false);
    }
  }, [totalTable, mutateList]);

  const openQrPreview = React.useCallback((value, tableNumber) => {
    if (!value) return;
    setPreviewQrValue(value);
    setPreviewTableNumber(tableNumber ?? "");
    setPreviewOpen(true);
  }, []);

  const handleDelete = React.useCallback((row) => {
    setDeleteDialog({ open: true, row });
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    const target = deleteDialog.row;
    const targetId = target?._id || target?.id;
    if (!targetId) return;

    await toastPromise(fnbMerchantTable.delete(targetId), {
      loading: `Menghapus meja "${target?.tableNumber ?? "-"}"...`,
      success: `Meja "${target?.tableNumber ?? "-"}" berhasil dihapus.`,
      error: (error) => getApiErrorMessage(error, "Gagal menghapus meja."),
    });

    await mutateList();
    setDeleteDialog({ open: false, row: null });
  }, [deleteDialog.row, mutateList]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "tableNumber",
        header: "NOMOR MEJA",
        size: 90,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <Typography sx={{ color: "#111827", fontSize: "0.88rem", fontWeight: 700, pl: 1 }}>
            {row.original.tableNumber ?? "-"}
          </Typography>
        ),
      },
      {
        accessorKey: "qrCode",
        header: "QR CODE",
        enableSorting: false,
        Cell: ({ row }) =>
          row.original.qrCode ? (
            <Box
              sx={{ py: 0.75, width: "fit-content", cursor: "zoom-in" }}
              onClick={() => openQrPreview(row.original.qrCode, row.original.tableNumber)}
            >
              <QRCode value={row.original.qrCode} size={84} />
            </Box>
          ) : (
            <Typography sx={{ color: "#6b7280", fontSize: "0.85rem" }}>-</Typography>
          ),
      },
    ],
    [openQrPreview]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    getRowId: (row, index) => row?._id || `row-${index}`,
    state: {
      isLoading: !listResponse && listLoading,
      showAlertBanner: !!listError,
      showProgressBars: listLoading && !listError,
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
    autoResetPageIndex: false,
    positionActionsColumn: "last",
    onSortingChange: (updater) => {
      setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "AKSI",
        muiTableHeadCellProps: { align: "left" },
      },
    },
    renderTopToolbar: () => (
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add size={20} color="white" />}
          onClick={() => setGenerateOpen(true)}
          sx={{ textTransform: "none", height: "40px", px: 2 }}
        >
          Generate QR
        </Button>
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
          <IconButton size="small" onClick={() => handleOpenDetail(row.original)}>
            <Eye size={20} color="#1976d2" variant="Linear" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus" arrow>
          <IconButton size="small" onClick={() => handleDelete(row.original)} sx={{ color: "#d32f2f" }}>
            <Trash size={20} color="#d32f2f" variant="Linear" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <Box sx={pageContainerSx}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
        <MaterialReactTable table={table} />
      </Paper>

      <GenerateQrFormDialog
        open={generateOpen}
        onClose={() => {
          setGenerateOpen(false);
          setGeneratedRows([]);
        }}
        totalTable={totalTable}
        onTotalTableChange={(event) => setTotalTable(event.target.value)}
        onSubmit={handleGenerate}
        submitting={submittingGenerate}
        generatedRows={generatedRows}
        onPreviewQr={openQrPreview}
      />

      <GenerateQrDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        loading={detailLoading}
        data={detailData}
        onPreviewQr={openQrPreview}
      />

      <QrPreviewDialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewTableNumber("");
        }}
        qrValue={previewQrValue}
        tableNumber={previewTableNumber}
        title={previewTableNumber ? `Preview QR Meja ${previewTableNumber}` : "Preview QR Meja"}
      />

      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, row: null })}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus <strong>Meja {deleteDialog.row?.tableNumber ?? "-"}</strong>?
          </Typography>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Box>
  );
}
