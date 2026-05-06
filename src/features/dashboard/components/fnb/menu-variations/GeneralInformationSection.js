"use client";

import React from "react";
import { Autocomplete, Box, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Gallery as GalleryIcon } from "iconsax-react";
import { SectionTitle } from "./parts";
import { adminFieldSx, adminLabelSx } from "./styles";
import { formatCurrencyIDR, formatRupiah, parseRupiah } from "@/shared/utils/format";

function RequiredMark() {
  return <Box component="span" sx={{ color: "#dc2626" }}> *</Box>;
}

const descriptionTextareaSx = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontFamily: "inherit",
  fontSize: "0.875rem",
  color: "#111827",
  padding: "10px 14px",
  lineHeight: 1.5,
  resize: "vertical",
  backgroundColor: "#fff",
  outline: "none",
};

function StaticField({ label, value }) {
  return (
    <Box>
      <Typography variant="body2" sx={adminLabelSx}>
        {label}
      </Typography>
      <Typography sx={{ color: "#111827", fontSize: "0.92rem", fontWeight: 500 }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

function ToggleRow({ label, checked, onChange, disabled = false }) {
  const switchText = checked ? "Aktif" : "Nonaktif";
  return (
    <Box sx={{ pt: 0.25 }}>
      <Typography variant="body2" sx={adminLabelSx}>
        {label}
      </Typography>
      <Box
        sx={{
          px: 1.25,
          py: 0.85,
          borderRadius: 1.8,
          bgcolor: checked ? "rgba(21, 93, 252, 0.07)" : "#f8fafc",
          border: "1px solid",
          borderColor: checked ? "rgba(21, 93, 252, 0.2)" : "#e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 40,
          transition: "all .18s ease",
        }}
      >
        <Typography
          sx={{
            color: checked ? "#155DFC" : "#6b7280",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          {switchText}
        </Typography>
        <Switch
          checked={checked}
          onChange={onChange}
          size="small"
          disabled={disabled}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#155DFC" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              bgcolor: "#155DFC",
              opacity: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
}

function GeneralInformationSection({
  sectionTitle = "Information",
  menuName = "",
  category = "",
  basePrice = "",
  minVariantPrice = "",
  statusLabel = "Active",
  description = "",
  addonGroupLabel = "",
  addonGroupItems = [],
  addonGroupItemsLoading = false,
  showAddonDetails = true,
  categories = ["Starters", "Main Course"],
  categoryOptions,
  imageHint = "",
  imagePlaceholderText = "No preview image",
  imagePreview = "",
  imageUrl = "",
  onImageUrlChange,
  onMenuNameChange,
  onCategoryChange,
  onBasePriceChange,
  onMinVariantPriceChange,
  onStatusChange,
  onDescriptionChange,
  useVariant = false,
  onUseVariantChange,
  statusChecked = true,
  addonGroups = [],
  addonGroupOptions = [],
  addonGroupLoading = false,
  addonGroupOpen = false,
  onAddonGroupOpen,
  onAddonGroupClose,
  onAddonGroupInputChange,
  onAddonGroupChange,
  readOnly = false,
}) {
  const resolvedCategoryOptions =
    categoryOptions?.length
      ? categoryOptions
      : categories.map((option) =>
          typeof option === "string" ? { label: option, value: option } : option
        );
  const categoryLabel =
    resolvedCategoryOptions.find((item) => item.value === category)?.label || category;

  return (
    <Box sx={{ p: { xs: 2, md: 2 } }}>
      <SectionTitle title={sectionTitle} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "220px minmax(0, 1fr)" },
          gap: 2,
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
              overflow: "hidden",
            }}
          >
            {imagePreview ? (
              <Box component="img" src={imagePreview} alt="Menu image preview" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <>
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
                <Typography sx={{ color: "#4b5563", fontSize: "0.9rem", fontWeight: 600 }}>
                  {imagePlaceholderText}
                </Typography>
              </>
            )}
          </Box>

          {imageHint ? (
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
          ) : null}

          {!readOnly ? (
            <Box sx={{ mt: 1.25 }}>
              <Typography variant="body2" sx={adminLabelSx}>
                Image URL
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={onImageUrlChange}
                sx={adminFieldSx}
              />
            </Box>
          ) : null}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {readOnly ? (
            <>
              <StaticField label="Menu Name" value={menuName} />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <StaticField label="Category" value={categoryLabel} />
                <ToggleRow label="Status" checked={statusChecked} disabled />
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <StaticField label="Base Price" value={basePrice} />
              <StaticField label="Min Variant Price" value={minVariantPrice} />
              </Box>
              <StaticField label="Description" value={description} />
              {showAddonDetails ? (
                <>
                  <StaticField label="Add On Group" value={addonGroupLabel} />
                  {addonGroupItemsLoading ? (
                    <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>Memuat item add-on...</Typography>
                  ) : addonGroupItems.length ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography variant="body2" sx={adminLabelSx}>
                        Add On Items
                      </Typography>
                      <Box sx={{ border: "1px solid #dbe3ef", borderRadius: 2, p: 1.25, bgcolor: "#f8fafc" }}>
                        <Stack spacing={1}>
                          {addonGroupItems.map((item) => (
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
                    </Box>
                  ) : null}
                </>
              ) : null}
              <ToggleRow label="Variant" checked={useVariant} disabled />
            </>
          ) : (
            <>
              <Box>
                <Typography variant="body2" sx={adminLabelSx}>
                  Menu Name<RequiredMark />
                </Typography>
                <TextField fullWidth size="small" required value={menuName} onChange={onMenuNameChange} sx={adminFieldSx} />
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={adminLabelSx}>
                    Category<RequiredMark />
                  </Typography>
                  <TextField select fullWidth size="small" required value={category} onChange={onCategoryChange} sx={adminFieldSx}>
                    {resolvedCategoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value} sx={{ fontSize: "0.875rem" }}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <ToggleRow label="Status" checked={statusChecked} onChange={onStatusChange} />
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={adminLabelSx}>
                    Base Price
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    inputMode="numeric"
                    disabled={useVariant}
                    value={formatRupiah(basePrice)}
                    onChange={(event) => onBasePriceChange?.(parseRupiah(event.target.value))}
                    sx={{
                      ...adminFieldSx,
                      "& .MuiInputBase-root.Mui-disabled": {
                        bgcolor: "#f3f4f6",
                        color: "#9ca3af",
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#9ca3af",
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={adminLabelSx}>
                    Min Variant Price
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    inputMode="numeric"
                    disabled={!useVariant}
                    value={formatRupiah(minVariantPrice)}
                    onChange={(event) => onMinVariantPriceChange?.(parseRupiah(event.target.value))}
                    sx={{
                      ...adminFieldSx,
                      "& .MuiInputBase-root.Mui-disabled": {
                        bgcolor: "#f3f4f6",
                        color: "#9ca3af",
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#9ca3af",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={adminLabelSx}>
                  Description<RequiredMark />
                </Typography>
                <TextareaAutosize
                  minRows={4}
                  required
                  value={description}
                  onChange={onDescriptionChange}
                  style={descriptionTextareaSx}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={adminLabelSx}>
                  Add On Group
                </Typography>
                <Autocomplete
                  multiple
                  fullWidth
                  size="small"
                  options={addonGroupOptions || []}
                  value={addonGroups || []}
                  loading={addonGroupLoading}
                  open={addonGroupOpen}
                  onOpen={onAddonGroupOpen}
                  onClose={onAddonGroupClose}
                  onInputChange={onAddonGroupInputChange}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, val) => option?._id === val?._id}
                  onChange={onAddonGroupChange}
                  renderInput={(params) => <TextField {...params} placeholder="Pilih add on group" />}
                />
              </Box>
              {addonGroupItemsLoading ? (
                <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>Memuat item add-on...</Typography>
              ) : addonGroupItems.length ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body2" sx={adminLabelSx}>
                    Add On Items
                  </Typography>
                  <Box sx={{ border: "1px solid #dbe3ef", borderRadius: 2, p: 1.25, bgcolor: "#f8fafc" }}>
                    <Stack spacing={1}>
                      {addonGroupItems.map((item) => (
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
                </Box>
              ) : null}

              <ToggleRow label="Variant" checked={useVariant} onChange={onUseVariantChange} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(GeneralInformationSection);
