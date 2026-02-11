"use client";

import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useFormikContext } from "formik";
import FilePicker from "@/components/FilePicker";

const companyMenuOptions = [
  "Dashboard",
  "Transaksi",
  "Laporan",
  "Pengaturan",
  "Manajemen",
  "Keuangan",
  "Pengguna",
];

export default function CompanyForm() {
  const { values, errors, touched, getFieldProps, setFieldValue } =
    useFormikContext();

  const handleMenuToggle = (menuName) => {
    setFieldValue(`companyMenus.${menuName}`, !values.companyMenus[menuName]);
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
      {/* Informasi Umum Section */}
      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Informasi Umum
        </Typography>
      </Box>

      {/* Logo Perusahaan */}
      <Box>
        <FilePicker
          value={values.logo}
          onChange={(file) => setFieldValue("logo", file)}
          accept="image/*"
          label="Logo Perusahaan"
          placeholder="Pilih Logo Perusahaan"
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
          {...getFieldProps("name")}
          placeholder="Nama Perusahaan"
          error={Boolean(touched.name && errors.name)}
          helperText={
            touched.name && errors.name
              ? errors.name
              : "Nama perusahaan maksimal 100 karakter"
          }
          required
        />
      </Box>

      {/* Inisial Perusahaan */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Inisial Perusahaan<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          {...getFieldProps("companyInitial")}
          placeholder="Inisial Perusahaan"
          error={Boolean(touched.companyInitial && errors.companyInitial)}
          helperText={touched.companyInitial && errors.companyInitial}
          required
        />
      </Box>

      {/* Alamat Perusahaan */}
      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Alamat Perusahaan<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={3}
          {...getFieldProps("address")}
          placeholder="Alamat Perusahaan"
          error={Boolean(touched.address && errors.address)}
          helperText={touched.address && errors.address}
          required
        />
      </Box>

      {/* Jenis Keuangan Perusahaan */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Jenis Keuangan Perusahaan<span style={{ color: "red" }}> *</span>
        </Typography>
        <FormControl fullWidth required>
          <Select
            size="small"
            {...getFieldProps("financialType")}
            onChange={(e) => setFieldValue("financialType", e.target.value)}
            error={Boolean(touched.financialType && errors.financialType)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Pilih Jenis Keuangan
            </MenuItem>
            <MenuItem value="Outlet 23">Outlet 23</MenuItem>
            <MenuItem value="Pandawa">Pandawa</MenuItem>
            <MenuItem value="Mizu">Mizu</MenuItem>
            <MenuItem value="Liquid">Liquid</MenuItem>
            <MenuItem value="Helen">Helen</MenuItem>
            <MenuItem value="Southgate">Southgate</MenuItem>
            <MenuItem value="KulkasBabe">KulkasBabe</MenuItem>
          </Select>
        </FormControl>
        <FormHelperText error={Boolean(touched.financialType && errors.financialType)}>
          {touched.financialType && errors.financialType}
        </FormHelperText>
      </Box>

      {/* Rekening Penagihan */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Rekening Penagihan<span style={{ color: "red" }}> *</span>
        </Typography>
        <FormControl fullWidth required>
          <Select
            size="small"
            {...getFieldProps("billingAccount")}
            onChange={(e) => setFieldValue("billingAccount", e.target.value)}
            error={Boolean(touched.billingAccount && errors.billingAccount)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Pilih Rekening Penagihan
            </MenuItem>
            <MenuItem value="Pandawa">Pandawa</MenuItem>
            <MenuItem value="Outlet 23">Outlet 23</MenuItem>
            <MenuItem value="Mizu">Mizu</MenuItem>
            <MenuItem value="Liquid">Liquid</MenuItem>
            <MenuItem value="Helen">Helen</MenuItem>
            <MenuItem value="Southgate">Southgate</MenuItem>
            <MenuItem value="KulkasBabe">KulkasBabe</MenuItem>
          </Select>
        </FormControl>
        <FormHelperText error={Boolean(touched.billingAccount && errors.billingAccount)}>
          {touched.billingAccount && errors.billingAccount}
        </FormHelperText>
      </Box>

      {/* PIC Section */}
      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="h6" fontWeight="bold" mb={2} mt={2}>
          PIC
        </Typography>
      </Box>

      {/* Nama PIC */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Nama PIC<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          {...getFieldProps("picName")}
          placeholder="Nama PIC"
          error={Boolean(touched.picName && errors.picName)}
          helperText={touched.picName && errors.picName}
          required
        />
      </Box>

      {/* Email */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Email<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="email"
          {...getFieldProps("picEmail")}
          placeholder="Email"
          error={Boolean(touched.picEmail && errors.picEmail)}
          helperText={touched.picEmail && errors.picEmail}
          required
        />
      </Box>

      {/* No Telepon */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          No telepon<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          {...getFieldProps("picPhone")}
          placeholder="No telepon"
          error={Boolean(touched.picPhone && errors.picPhone)}
          helperText={touched.picPhone && errors.picPhone}
          required
        />
      </Box>

      {/* Username */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Username<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          {...getFieldProps("picUsername")}
          placeholder="Username"
          error={Boolean(touched.picUsername && errors.picUsername)}
          helperText={touched.picUsername && errors.picUsername}
          required
        />
      </Box>

      {/* Password */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Password<span style={{ color: "red" }}> *</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="password"
          {...getFieldProps("picPassword")}
          placeholder="Password"
          error={Boolean(touched.picPassword && errors.picPassword)}
          helperText={touched.picPassword && errors.picPassword}
          required
        />
      </Box>

      {/* Aplikasi Section */}
      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="h6" fontWeight="bold" mb={2} mt={2}>
          Aplikasi
        </Typography>
      </Box>

      {/* Homepage */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Homepage<span style={{ color: "red" }}> *</span>
        </Typography>
        <FormControl fullWidth required>
          <Select
            size="small"
            {...getFieldProps("homepage")}
            onChange={(e) => setFieldValue("homepage", e.target.value)}
            error={Boolean(touched.homepage && errors.homepage)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Pilih Homepage
            </MenuItem>
            <MenuItem value="Dashboard">Dashboard</MenuItem>
            <MenuItem value="Transaksi">Transaksi</MenuItem>
            <MenuItem value="Laporan">Laporan</MenuItem>
            <MenuItem value="Pengaturan">Pengaturan</MenuItem>
            <MenuItem value="Manajemen">Manajemen</MenuItem>
            <MenuItem value="Keuangan">Keuangan</MenuItem>
            <MenuItem value="Pengguna">Pengguna</MenuItem>
          </Select>
        </FormControl>
        <FormHelperText error={Boolean(touched.homepage && errors.homepage)}>
          {touched.homepage && errors.homepage}
        </FormHelperText>
      </Box>

      {/* Menu Perusahaan */}
      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Menu Perusahaan
        </Typography>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {companyMenuOptions.map((menuName) => (
              <FormControlLabel
                key={menuName}
                control={
                  <Switch
                    checked={values.companyMenus[menuName] || false}
                    onChange={() => handleMenuToggle(menuName)}
                    color="primary"
                  />
                }
                label={menuName}
                sx={{
                  justifyContent: "space-between",
                  margin: 0,
                  width: "100%",
                  "& .MuiFormControlLabel-label": {
                    flex: 1,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
