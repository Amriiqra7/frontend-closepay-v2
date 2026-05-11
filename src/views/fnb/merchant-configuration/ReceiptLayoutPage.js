"use client";

import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { Image as ImageIcon } from "iconsax-react";

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
  footerText: {
    label: "Teks bagian bawah",
    helper: "Beberapa baris dipisah dengan Enter.",
  },
};

const FIELD_ORDER = ["logo", "merchantName", "address", "footerText"];

const DEFAULT_STATE = {
  logoUrl: "",
  merchantName: "ClosePay",
  address: "Alamat Toko / Instansi",
  footerText: "Terima kasih atas kunjungan Anda.",
  topFields: ["logo", "merchantName", "address"],
  bottomFields: ["footerText"],
};

const moveWithin = (list, fromIndex, toIndex) => {
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const moveAcross = (sourceList, destList, sourceIndex, destIndex) => {
  const source = [...sourceList];
  const destination = [...destList];
  const [moved] = source.splice(sourceIndex, 1);
  destination.splice(destIndex, 0, moved);
  return { source, destination };
};

function ReceiptPreview({ state }) {
  const footerLines = state.footerText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const renderField = (field) => {
    if (field === "logo") {
      return (
        <Box key={field} sx={{ textAlign: "center", mb: 0.5 }}>
          {state.logoUrl ? (
            <Box component="img" src={state.logoUrl} alt="Logo merchant" sx={{ width: 64, height: 64, objectFit: "contain", mx: "auto" }} />
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

    if (field === "footerText") {
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
      <Stack spacing={0.95}>
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

  const handleResetDefault = () => setForm(DEFAULT_STATE);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId) {
      if (source.index === destination.index) return;
      const key = sourceId === "top" ? "topFields" : "bottomFields";
      setForm((prev) => ({
        ...prev,
        [key]: moveWithin(prev[key], source.index, destination.index),
      }));
      return;
    }

    setForm((prev) => {
      const sourceKey = sourceId === "top" ? "topFields" : "bottomFields";
      const destKey = destId === "top" ? "topFields" : "bottomFields";
      const { source: nextSource, destination: nextDestination } = moveAcross(
        prev[sourceKey],
        prev[destKey],
        source.index,
        destination.index
      );

      return {
        ...prev,
        [sourceKey]: nextSource,
        [destKey]: nextDestination,
      };
    });
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: { xs: 2, md: 3 } }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end" sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", height: "40px", px: 2 }}
            >
              Simpan struk
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResetDefault}
              sx={{ textTransform: "none", height: "40px", px: 2 }}
            >
              Kembalikan default
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
                                    />
                                  ) : null}

                                  {field === "address" ? (
                                    <TextField
                                      fullWidth
                                      value={form.address}
                                      onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                                      placeholder="Opsional - baris kedua di bawah nama"
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
                                  {field === "footerText" ? (
                                    <TextField
                                      fullWidth
                                      multiline
                                      minRows={4}
                                      value={form.footerText}
                                      onChange={(event) => setForm((prev) => ({ ...prev, footerText: event.target.value }))}
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
