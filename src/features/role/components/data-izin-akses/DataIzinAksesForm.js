"use client";

import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useFormikContext } from "formik";

// Mock data untuk dropdown options
const mockServices = [
  { id: 1, nama: "user" },
  { id: 2, nama: "transaction" },
  { id: 3, nama: "report" },
  { id: 4, nama: "notification" },
];

const mockUserTypes = [
  { id: 1, nama: "admin" },
  { id: 2, nama: "member" },
  { id: 3, nama: "viewer" },
];

const mockGroups = [
  { id: 1, nama: "Membership" },
  { id: 2, nama: "Transaction" },
  { id: 3, nama: "Report" },
  { id: 4, nama: "Notification" },
];

export default function DataIzinAksesForm() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 2,
        border: "none"
      }}
    >
      {/* Servis */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          Servis<span style={{ color: "red" }}> *</span>
        </Typography>
        <FormControl fullWidth size="small" error={Boolean(touched.servis && errors.servis)}>
          <Select
            value={values.servis || ""}
            onChange={(e) => setFieldValue("servis", e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.875rem' }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
              Pilih servis
            </MenuItem>
            {mockServices.map((service) => (
              <MenuItem key={service.id} value={service.nama} sx={{ fontSize: '0.875rem' }}>
                {service.nama}
              </MenuItem>
            ))}
          </Select>
          {touched.servis && errors.servis && (
            <FormHelperText sx={{ fontSize: '0.75rem' }}>{errors.servis}</FormHelperText>
          )}
        </FormControl>
      </Box>

      {/* Nama */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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
          InputProps={{
            sx: { fontSize: '0.875rem' }
          }}
          inputProps={{
            style: { fontSize: '0.875rem' }
          }}
          FormHelperTextProps={{
            sx: { fontSize: '0.75rem' }
          }}
        />
      </Box>

      {/* User Tipe */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          User Tipe<span style={{ color: "red" }}> *</span>
        </Typography>
        <FormControl fullWidth size="small" error={Boolean(touched.userTipe && errors.userTipe)}>
          <Select
            value={values.userTipe || ""}
            onChange={(e) => setFieldValue("userTipe", e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.875rem' }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
              Pilih user tipe
            </MenuItem>
            {mockUserTypes.map((type) => (
              <MenuItem key={type.id} value={type.nama} sx={{ fontSize: '0.875rem' }}>
                {type.nama}
              </MenuItem>
            ))}
          </Select>
          {touched.userTipe && errors.userTipe && (
            <FormHelperText sx={{ fontSize: '0.75rem' }}>{errors.userTipe}</FormHelperText>
          )}
        </FormControl>
      </Box>

      {/* Kode */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          Kode<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={values.kode}
          onChange={(e) => setFieldValue("kode", e.target.value)}
          placeholder="Kode"
          error={Boolean(touched.kode && errors.kode)}
          helperText={touched.kode && errors.kode}
          required
          InputProps={{
            sx: { fontSize: '0.875rem' }
          }}
          inputProps={{
            style: { fontSize: '0.875rem' }
          }}
          FormHelperTextProps={{
            sx: { fontSize: '0.75rem' }
          }}
        />
      </Box>

      {/* Grup */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
          Grup<span style={{ color: "red" }}> *</span>
        </Typography>
        <Autocomplete
          freeSolo
          fullWidth
          size="small"
          options={mockGroups.map((group) => group.nama)}
          value={values.grup || null}
          onChange={(_, newValue) => {
            setFieldValue("grup", newValue || "");
          }}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === "input") {
              setFieldValue("grup", newInputValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Pilih grup atau ketik sendiri"
              error={Boolean(touched.grup && errors.grup)}
              helperText={touched.grup && errors.grup}
              InputProps={{
                ...params.InputProps,
                sx: { fontSize: '0.875rem' }
              }}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
              }}
            />
          )}
        />
      </Box>

      {/* Deskripsi */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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
          InputProps={{
            sx: { fontSize: '0.875rem' }
          }}
          inputProps={{
            style: { fontSize: '0.875rem' }
          }}
          FormHelperTextProps={{
            sx: { fontSize: '0.75rem' }
          }}
        />
      </Box>
    </Box>
  );
}
