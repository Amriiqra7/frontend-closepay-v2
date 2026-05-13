"use client";

import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { adminLabelSx } from "./styles";
import { formatCurrencyIDR } from "@/shared/utils/format";

function ItemRow({ item }) {
  return (
    <Box
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
  );
}

function AddonGroupItemsSection({
  sections = [],
  loading = false,
  title = "Add On Items",
  emptyText = "Belum ada item add-on.",
}) {
  if (loading) {
    return (
      <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>Memuat item add-on...</Typography>
    );
  }

  if (!sections.length) {
    return <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>{emptyText}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="body2" sx={adminLabelSx}>
        {title}
      </Typography>
      <Stack spacing={1.25}>
        {sections.map((section) => (
          <Paper
            key={section?._id || section?.name}
            elevation={0}
            sx={{ border: "1px solid #dbe3ef", borderRadius: 2, p: 1.25, bgcolor: "#f8fafc" }}
          >
            <Typography sx={{ color: "#111827", fontSize: "0.86rem", fontWeight: 700, mb: 1 }}>
              {section?.name || "Add On Group"}
            </Typography>
            {section?.items?.length ? (
              <Stack spacing={1}>
                {section.items.map((item) => (
                  <ItemRow key={item?._id || item?.name} item={item} />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                {emptyText}
              </Typography>
            )}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default React.memo(AddonGroupItemsSection);
