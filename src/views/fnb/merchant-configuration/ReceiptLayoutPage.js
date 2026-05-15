"use client";

import React from "react";
import useSWR from "swr";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { Image as ImageIcon } from "iconsax-react";
import { fnbMerchantReceiptTemplate } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";

const FIELD_META = {
  logo: {
    label: "Logo",
    helper: "Pakai URL gambar dan preview akan langsung berubah.",
  },
  merchantName: {
    label: "Nama usaha / header",
    helper: "Nama merchant yang tampil di bagian atas struk.",
  },
  address: {
    label: "Alamat atau slogan",
    helper: "Bisa dipakai sebagai alamat, cabang, atau slogan.",
  },
  text: {
    label: "Teks bagian bawah",
    helper: "Beberapa baris dipisah dengan Enter.",
  },
};

const FIELD_ORDER = ["logo", "merchantName", "address", "text"];
const BOTTOM_FIELDS = ["text"];
const FIELD_VALUE_KEY = {
  logo: "logoUrl",
  merchantName: "merchantName",
  address: "address",
  text: "text",
};

const DEFAULT_STATE = {
  logoUrl: "",
  merchantName: "ClosePay",
  address: "Alamat Toko / Instansi",
  text: "Terima kasih atas kunjungan Anda.",
  topFields: ["logo", "merchantName", "address"],
  bottomFields: ["text"],
};

const moveWithin = (list, fromIndex, toIndex) => {
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

function ReceiptPreview({ state }) {
  const footerLines = state.text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const renderField = (field) => {
    if (field === "logo") {
      return (
        <Box key={field} sx={{ textAlign: "center" }}>
          {state.logoUrl ? (
            <Box
              component="img"
              src={state.logoUrl}
              alt="Logo merchant"
              sx={{ width: 64, maxHeight: 80, objectFit: "contain", mx: "auto", display: "block" }}
            />
          ) : (
            <Box
              sx={{
                width: 96,
                height: 64,
                mx: "auto",
                border: "1px dashed #cbd5e1",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f8fafc",
              }}
            >
              <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#64748b" }}>[ LOGO ]</Typography>
            </Box>
          )}
        </Box>
      );
    }

    if (field === "merchantName") {
      return (
        <Typography key={field} sx={{ textAlign: "center", fontWeight: 700, fontSize: "1.9rem", lineHeight: 1.1 }}>
          {state.merchantName || "-"}
        </Typography>
      );
    }

    if (field === "address") {
      return (
        <Typography key={field} sx={{ textAlign: "center", fontSize: "0.9rem", color: "#475569" }}>
          {state.address || "-"}
        </Typography>
      );
    }

    if (field === "text") {
      return footerLines.length ? (
        <Stack key={field} spacing={0.35} sx={{ pt: 0.5 }}>
          {footerLines.map((line) => (
            <Typography key={line} sx={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.92rem" }}>
              {line}
            </Typography>
          ))}
        </Stack>
      ) : null;
    }

    return null;
  };

  const receiptTextSx = {
    fontSize: "0.92rem",
    color: "#0f172a",
    lineHeight: 1.35,
    fontWeight: 600,
  };

  const receiptRowSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
  };

  return (
    <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 4, p: 2.5, maxWidth: 380, mx: "auto", bgcolor: "#fff" }}>
      <Stack spacing={0.8}>
        {state.topFields.map((field) => renderField(field))}

        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", mt: 0.8, mb: 0.2 }}>NO ANTRIAN</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: "2.25rem", lineHeight: 1.05, mb: 0.45 }}>A-03</Typography>
        <Typography sx={receiptTextSx}>Tanggal 05/05/2026</Typography>
        <Typography sx={receiptTextSx}>Jam 21.45</Typography>
        <Typography sx={receiptTextSx}>Kasir -</Typography>
        <Typography sx={receiptTextSx}>Order ID __preview__</Typography>

        <Stack spacing={0.9} sx={{ mt: 1.5, mb: 1.35 }}>
          <Box sx={receiptRowSx}>
            <Typography sx={receiptTextSx}>Pembayaran</Typography>
            <Typography sx={receiptTextSx}>Cash</Typography>
          </Box>
          <Box sx={receiptRowSx}>
            <Typography sx={receiptTextSx}>Jenis pesanan</Typography>
            <Typography sx={receiptTextSx}>Makan di tempat</Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "#64748b", my: 1.2 }} />
        <Box sx={{ ...receiptRowSx, py: 1.2 }}>
          <Typography sx={receiptTextSx}>Contoh menu x1</Typography>
          <Typography sx={receiptTextSx}>Rp 27.500</Typography>
        </Box>
        <Divider sx={{ borderColor: "#64748b", my: 1.2 }} />
        <Stack spacing={0.9} sx={{ mt: 1.35, mb: 1.4 }}>
          <Box sx={receiptRowSx}>
            <Typography sx={receiptTextSx}>Bayar (Cash)</Typography>
            <Typography sx={receiptTextSx}>Rp 27.500</Typography>
          </Box>
          <Box sx={receiptRowSx}>
            <Typography sx={receiptTextSx}>Kembalian</Typography>
            <Typography sx={receiptTextSx}>Rp 0</Typography>
          </Box>
        </Stack>
        <Box sx={{ ...receiptRowSx, mt: 0.9 }}>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.2 }}>Total</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.2 }}>Rp 27.500</Typography>
        </Box>
        {state.bottomFields.map((field) => renderField(field))}
      </Stack>
    </Paper>
  );
}

const moveAcross = (sourceList, destList, sourceIndex, destIndex) => {
  const source = [...sourceList];
  const destination = [...destList];
  const [moved] = source.splice(sourceIndex, 1);
  destination.splice(destIndex, 0, moved);
  return { source, destination };
};

function LayoutCard({ field, draggableProps, dragHandleProps, innerRef, isDragging, children }) {
  return (
    <Paper
      ref={innerRef}
      {...draggableProps}
      elevation={0}
      sx={{
        border: "1px solid #e8edf3",
        borderRadius: 2.5,
        p: 2,
        bgcolor: "#fff",
        boxShadow: isDragging ? "0 8px 22px rgba(15, 23, 42, 0.12)" : "none",
      }}
    >
      <Stack spacing={1.25}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>{FIELD_META[field].label}</Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.82rem", mt: 0.35 }}>{FIELD_META[field].helper}</Typography>
          </Box>
          <Box
            {...dragHandleProps}
            sx={{
              fontSize: "0.78rem",
              color: "#64748b",
              border: "1px dashed #cbd5e1",
              borderRadius: 1.5,
              px: 1,
              py: 0.35,
              cursor: "grab",
              userSelect: "none",
            }}
          >
            Drag
          </Box>
        </Box>
        {children}
      </Stack>
    </Paper>
  );
}

function SectionTitle({ title, helper }) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>{title}</Typography>
      <Typography sx={{ color: "#64748b", fontSize: "0.82rem", mt: 0.25 }}>{helper}</Typography>
    </Box>
  );
}

export default function ReceiptLayoutPage() {
  const [form, setForm] = React.useState(DEFAULT_STATE);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [isReordering, setIsReordering] = React.useState(false);
  const hasTriedGenerateDefaultRef = React.useRef(false);

  const { data: receiptTemplateResponse, error: receiptTemplateError, mutate } = useSWR(
    "fnb-receipt-template-get",
    () => fnbMerchantReceiptTemplate.get(),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    if (!receiptTemplateError || hasTriedGenerateDefaultRef.current) return;

    hasTriedGenerateDefaultRef.current = true;
    (async () => {
      try {
        await fnbMerchantReceiptTemplate.generateDefault();
        await mutate();
      } catch (error) {
        showErrorToast(getApiErrorMessage(error, "Gagal membuat tata letak struk default."));
      }
    })();
  }, [receiptTemplateError, mutate]);

  React.useEffect(() => {
    const items = receiptTemplateResponse?.data?.items;
    if (!Array.isArray(items) || !items.length) return;

    const sorted = [...items].sort((a, b) => Number(a?.sortOrder || 0) - Number(b?.sortOrder || 0));
    const orderedFields = sorted
      .map((item) => item?.field)
      .filter((field, index, array) => FIELD_ORDER.includes(field) && array.indexOf(field) === index);

    const values = sorted.reduce((acc, item) => {
      if (!FIELD_ORDER.includes(item?.field)) return acc;
      const key = FIELD_VALUE_KEY[item.field];
      if (!key) return acc;
      acc[key] = item?.value ?? "";
      return acc;
    }, {});

    const topFields = orderedFields.filter((field) => !BOTTOM_FIELDS.includes(field));
    const bottomFields = orderedFields.filter((field) => BOTTOM_FIELDS.includes(field));

    setForm((prev) => ({
      ...prev,
      ...values,
      topFields: topFields.length ? topFields : prev.topFields,
      bottomFields: bottomFields.length ? bottomFields : prev.bottomFields,
    }));
  }, [receiptTemplateResponse]);

  const buildItemsPayload = React.useCallback((nextForm) => {
    const mergedFields = [...nextForm.topFields, ...nextForm.bottomFields];
    const fieldSet = new Set(mergedFields);
    const orderedFields = [...mergedFields, ...FIELD_ORDER.filter((field) => !fieldSet.has(field))];
    return orderedFields.map((field, index) => ({
      field,
      value: nextForm[FIELD_VALUE_KEY[field]] || null,
      sortOrder: index + 1,
    }));
  }, []);

  const handleResetDefault = React.useCallback(async () => {
    setIsResetting(true);
    try {
      await toastPromise(fnbMerchantReceiptTemplate.resetDefault(), {
        loading: "Mengembalikan tata letak default...",
        success: "Tata letak struk berhasil dikembalikan ke default.",
        error: (error) => getApiErrorMessage(error, "Gagal mengembalikan tata letak default."),
      });
      await mutate();
    } finally {
      setIsResetting(false);
    }
  }, [mutate]);

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = { items: buildItemsPayload(form) };
      await toastPromise(fnbMerchantReceiptTemplate.save(payload), {
        loading: "Menyimpan tata letak struk...",
        success: "Tata letak struk berhasil disimpan.",
        error: (error) => getApiErrorMessage(error, "Gagal menyimpan tata letak struk."),
      });
      await mutate();
    } finally {
      setIsSaving(false);
    }
  }, [buildItemsPayload, form, mutate]);

  const handleUpdateValue = React.useCallback(async (field) => {
    if (!FIELD_ORDER.includes(field)) return;
    await toastPromise(
      fnbMerchantReceiptTemplate.updateValue({
        field,
        value: form[FIELD_VALUE_KEY[field]] || null,
      }),
      {
        loading: "Menyimpan perubahan field...",
        success: "Field tata letak struk berhasil diperbarui.",
        error: (error) => getApiErrorMessage(error, "Gagal memperbarui field tata letak struk."),
      }
    );
  }, [form]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId) {
      if (source.index === destination.index) return;
      const key = sourceId === "top" ? "topFields" : "bottomFields";
      const nextForm = {
        ...form,
        [key]: moveWithin(form[key], source.index, destination.index),
      };
      setForm(nextForm);

      setIsReordering(true);
      toastPromise(
        fnbMerchantReceiptTemplate.reorder({
          items: buildItemsPayload(nextForm),
        }),
        {
          loading: "Menyimpan urutan tata letak...",
          success: "Urutan tata letak struk berhasil diperbarui.",
          error: (error) => getApiErrorMessage(error, "Gagal memperbarui urutan tata letak struk."),
        }
      ).finally(() => setIsReordering(false));
      return;
    }

    const sourceKey = sourceId === "top" ? "topFields" : "bottomFields";
    const destKey = destId === "top" ? "topFields" : "bottomFields";
    const { source: nextSource, destination: nextDestination } = moveAcross(
      form[sourceKey],
      form[destKey],
      source.index,
      destination.index
    );
    const nextForm = {
      ...form,
      [sourceKey]: nextSource,
      [destKey]: nextDestination,
    };
    setForm(nextForm);

    setIsReordering(true);
    toastPromise(
      fnbMerchantReceiptTemplate.reorder({
        items: buildItemsPayload(nextForm),
      }),
      {
        loading: "Menyimpan urutan tata letak...",
        success: "Urutan tata letak struk berhasil diperbarui.",
        error: (error) => getApiErrorMessage(error, "Gagal memperbarui urutan tata letak struk."),
      }
    ).finally(() => setIsReordering(false));
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: { xs: 2, md: 3 } }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end" sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving || isResetting || isReordering}
              sx={{ textTransform: "none", height: "40px", px: 2 }}
            >
              {isSaving ? "Menyimpan..." : "Simpan struk"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResetDefault}
              disabled={isSaving || isResetting || isReordering}
              sx={{ textTransform: "none", height: "40px", px: 2 }}
            >
              {isResetting ? "Memproses..." : "Kembalikan default"}
            </Button>
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" }, gap: 2.5 }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Stack spacing={2}>
                <Droppable droppableId="top">
                  {(provided, snapshot) => (
                    <Paper
                      elevation={0}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        border: "1px solid",
                        borderColor: snapshot.isDraggingOver ? "#155DFC" : "#e8edf3",
                        borderRadius: 2.5,
                        p: 2,
                        bgcolor: snapshot.isDraggingOver ? "rgba(21, 93, 252, 0.03)" : "#fff",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <SectionTitle
                          title="Bagian Atas"
                          helper="Semua item di sini akan muncul sebelum isi struk."
                        />
                        <Stack spacing={1.5}>
                          {form.topFields.map((field, index) => (
                            <Draggable key={field} draggableId={field} index={index}>
                              {(draggable, dragSnapshot) => (
                                <LayoutCard
                                  field={field}
                                  innerRef={draggable.innerRef}
                                  draggableProps={draggable.draggableProps}
                                  dragHandleProps={draggable.dragHandleProps}
                                  isDragging={dragSnapshot.isDragging}
                                >
                                  {field === "logo" ? (
                                    <Stack spacing={1.2}>
                                      <TextField
                                        fullWidth
                                        value={form.logoUrl}
                                        onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))}
                                        onBlur={() => handleUpdateValue("logo")}
                                        placeholder="https://contoh.com/logo.png"
                                        InputProps={{
                                          startAdornment: <ImageIcon size={18} color="#94a3b8" style={{ marginRight: 8 }} />,
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          border: "1px dashed #cbd5e1",
                                          borderRadius: 2,
                                          height: 180,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          bgcolor: "#f8fafc",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {form.logoUrl ? (
                                          <Box
                                            component="img"
                                            src={form.logoUrl}
                                            alt="Preview logo"
                                            sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                          />
                                        ) : (
                                          <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                                            Preview logo akan tampil di sini
                                          </Typography>
                                        )}
                                      </Box>
                                    </Stack>
                                  ) : null}

                                  {field === "merchantName" ? (
                                    <TextField
                                      fullWidth
                                      value={form.merchantName}
                                      onChange={(event) => setForm((prev) => ({ ...prev, merchantName: event.target.value }))}
                                      onBlur={() => handleUpdateValue("merchantName")}
                                    />
                                  ) : null}

                                  {field === "address" ? (
                                    <TextField
                                      fullWidth
                                      value={form.address}
                                      onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                                      onBlur={() => handleUpdateValue("address")}
                                      placeholder="Opsional - baris kedua di bawah nama"
                                    />
                                  ) : null}

                                  {field === "text" ? (
                                    <TextField
                                      fullWidth
                                      multiline
                                      minRows={4}
                                      value={form.text}
                                      onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
                                      onBlur={() => handleUpdateValue("text")}
                                    />
                                  ) : null}
                                </LayoutCard>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Stack>
                      </Stack>
                    </Paper>
                  )}
                </Droppable>

                <Droppable droppableId="bottom">
                  {(provided, snapshot) => (
                    <Paper
                      elevation={0}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        border: "1px solid",
                        borderColor: snapshot.isDraggingOver ? "#155DFC" : "#e8edf3",
                        borderRadius: 2.5,
                        p: 2,
                        bgcolor: snapshot.isDraggingOver ? "rgba(21, 93, 252, 0.03)" : "#fff",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <SectionTitle
                          title="Bagian Bawah"
                          helper="Semua item di sini akan muncul sesudah total struk."
                        />
                        <Stack spacing={1.5}>
                          {form.bottomFields.map((field, index) => (
                            <Draggable key={field} draggableId={field} index={index}>
                              {(draggable, dragSnapshot) => (
                                <LayoutCard
                                  field={field}
                                  innerRef={draggable.innerRef}
                                  draggableProps={draggable.draggableProps}
                                  dragHandleProps={draggable.dragHandleProps}
                                  isDragging={dragSnapshot.isDragging}
                                >
                                  {field === "text" ? (
                                    <TextField
                                      fullWidth
                                      multiline
                                      minRows={4}
                                      value={form.text}
                                      onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
                                      onBlur={() => handleUpdateValue("text")}
                                    />
                                  ) : null}
                                </LayoutCard>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Stack>
                      </Stack>
                    </Paper>
                  )}
                </Droppable>
              </Stack>
            </DragDropContext>

            <Box>
              <Paper
                elevation={0}
                sx={{
                  mb: 1.5,
                  border: "1px solid #e8edf3",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1.1,
                  bgcolor: "#f8fafc",
                }}
              >
                <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.92rem", letterSpacing: 0.6, lineHeight: 1.1 }}>
                  PRATINJAU STRUK
                </Typography>
                <Typography sx={{ mt: 0.35, color: "#64748b", fontSize: "0.78rem", lineHeight: 1.25 }}>
                  Tampilan simulasi cetak struk berdasarkan pengaturan saat ini.
                </Typography>
              </Paper>
              <ReceiptPreview state={form} />
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
