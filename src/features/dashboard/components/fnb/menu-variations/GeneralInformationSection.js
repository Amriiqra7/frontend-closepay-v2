"use client";

import React from "react";
import {
  Box,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Gallery as GalleryIcon } from "iconsax-react";
import { SectionTitle } from "./parts";
import { adminFieldSx, adminLabelSx } from "./styles";

export default function GeneralInformationSection({
  menuName = "Artisan Green Salad",
  category = "Starters",
  statusLabel = "Active",
  description = "Organic baby kale, heritage tomatoes, toasted pine nuts, and a balsamic truffle glaze. Served chilled with a side of house-made sourdough crisps.",
  categories = ["Starters", "Main Course"],
  imageHint = "Optimized for Web: 800x800px, WEBP format recommended.",
  imagePlaceholderText = "No preview image",
  onMenuNameChange,
  onCategoryChange,
  onStatusChange,
  onDescriptionChange,
  statusChecked = true,
}) {
  return (
    <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
      <SectionTitle title="General Information" />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "220px minmax(0, 1fr)" },
          gap: 3,
        }}
      >
        <Box>
          <Box
            sx={{
              height: 210,
              borderRadius: 2.5,
              border: "1px dashed #cfd8e3",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#f0f4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GalleryIcon size={30} color="#155DFC" variant="Bold" />
            </Box>

            <Typography
              sx={{ color: "#4b5563", fontSize: "0.9rem", fontWeight: 600 }}
            >
              {imagePlaceholderText}
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 1,
              color: "#9aa5b1",
              fontSize: "0.7rem",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            {imageHint}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
          <Box>
            <Typography variant="body2" sx={adminLabelSx}>
              Menu Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={menuName}
              onChange={onMenuNameChange}
              placeholder="Menu Name"
              InputProps={{ sx: { fontSize: "0.875rem" } }}
              inputProps={{ style: { fontSize: "0.875rem" } }}
              FormHelperTextProps={{ sx: { fontSize: "0.75rem" } }}
              sx={adminFieldSx}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" sx={adminLabelSx}>
                Category
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={category}
                onChange={onCategoryChange}
                InputProps={{ sx: { fontSize: "0.875rem" } }}
                inputProps={{ style: { fontSize: "0.875rem" } }}
                sx={adminFieldSx}
              >
                {categories.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="body2" sx={adminLabelSx}>
                Status
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  px: 1.5,
                  py: 0.7,
                  minHeight: 40,
                  borderRadius: 1,
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#111827",
                    fontSize: "0.875rem",
                    fontWeight: 400,
                  }}
                >
                  {statusLabel}
                </Typography>
                <Switch
                  checked={statusChecked}
                  onChange={onStatusChange}
                  size="small"
                />
              </Paper>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={adminLabelSx}>
              Description
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              size="small"
              value={description}
              onChange={onDescriptionChange}
              placeholder="Description"
              InputProps={{ sx: { fontSize: "0.875rem" } }}
              inputProps={{ style: { fontSize: "0.875rem" } }}
              FormHelperTextProps={{ sx: { fontSize: "0.75rem" } }}
              sx={adminFieldSx}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
