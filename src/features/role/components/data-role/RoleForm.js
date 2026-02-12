"use client";

import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  Button,
  FormHelperText,
} from "@mui/material";
import { useFormikContext } from "formik";
import { Security } from "iconsax-react";

// Mock data untuk dropdown options
const mockCompanies = [
  { id: 1, nama: "PT Bougenvile Blok" },
  { id: 2, nama: "PT Kantin FKi 12" },
  { id: 3, nama: "PT Perusahaan ABC" },
  { id: 4, nama: "CV XYZ Indonesia" },
];

const mockUserTypes = [
  { id: 1, nama: "Administrator" },
  { id: 2, nama: "Manager" },
  { id: 3, nama: "Operator" },
  { id: 4, nama: "Viewer" },
];

export default function RoleForm() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const handleOpenPermissionDialog = () => {
    // TODO: Implement permission selection dialog
    console.log("Open permission dialog");
    alert("Dialog Pilih Izin Keamanan akan dibuka di sini");
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 2,
        border: "none"
      }}
    >
      {/* Perusahaan */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Perusahaan<span style={{ color: "red" }}> *</span>
        </Typography>
        <Autocomplete
          fullWidth
          size="small"
          options={mockCompanies}
          getOptionLabel={(option) => option?.nama || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          value={values.perusahaan}
          onChange={(_, newValue) => {
            setFieldValue("perusahaan", newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Pilih perusahaan"
              error={Boolean(touched.perusahaan && errors.perusahaan)}
              helperText={
                touched.perusahaan && errors.perusahaan
                  ? errors.perusahaan
                  : ""
              }
            />
          )}
        />
      </Box>

      {/* Nama */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Nama<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={values.nama}
          onChange={(e) => setFieldValue("nama", e.target.value)}
          placeholder="Nama"
          error={Boolean(touched.nama && errors.nama)}
          helperText={touched.nama && errors.nama}
          required
        />
      </Box>

      {/* User Tipe */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          User Tipe<span style={{ color: "red" }}> *</span>
        </Typography>
        <Autocomplete
          fullWidth
          size="small"
          options={mockUserTypes}
          getOptionLabel={(option) => option?.nama || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          value={values.userTipe}
          onChange={(_, newValue) => {
            setFieldValue("userTipe", newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Pilih user tipe"
              error={Boolean(touched.userTipe && errors.userTipe)}
              helperText={
                touched.userTipe && errors.userTipe
                  ? errors.userTipe
                  : ""
              }
            />
          )}
        />
      </Box>

      {/* Deskripsi */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Deskripsi
        </Typography>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={4}
          value={values.deskripsi}
          onChange={(e) => setFieldValue("deskripsi", e.target.value)}
          placeholder="Deskripsi"
          error={Boolean(touched.deskripsi && errors.deskripsi)}
          helperText={touched.deskripsi && errors.deskripsi}
        />
      </Box>

      {/* Pilih Izin Keamanan Button */}
      <Box sx={{ gridColumn: { xs: "1 / -1", md: "1" } }}>
        <Button
          variant="contained"
          startIcon={<Security size={20} color="currentColor" />}
          onClick={handleOpenPermissionDialog}
          sx={{
            textTransform: "none",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          Pilih Izin Keamanan
        </Button>
        {touched.izinKeamanan && errors.izinKeamanan && (
          <FormHelperText error sx={{ mt: 0.5 }}>
            {errors.izinKeamanan}
          </FormHelperText>
        )}
      </Box>
    </Box>
  );
}
