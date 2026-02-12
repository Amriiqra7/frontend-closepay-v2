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
import FilePicker from "@/shared/ui/FilePicker";

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
        gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
        gap: 3,
        border: "none"
      }}
    >
      {/* Left Column: Informasi Umum + PIC */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Informasi Umum Section */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Informasi Umum
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >

            {/* Logo Perusahaan */}
            <Box sx={{ gridColumn: "1 / -1" }}>
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
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* Inisial Perusahaan */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* Alamat Perusahaan */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* Jenis Keuangan Perusahaan */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                Jenis Keuangan Perusahaan<span style={{ color: "red" }}> *</span>
              </Typography>
              <FormControl fullWidth required>
                <Select
                  size="small"
                  {...getFieldProps("financialType")}
                  onChange={(e) => setFieldValue("financialType", e.target.value)}
                  error={Boolean(touched.financialType && errors.financialType)}
                  displayEmpty
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                    Pilih Jenis Keuangan
                  </MenuItem>
                  <MenuItem value="Outlet 23" sx={{ fontSize: '0.875rem' }}>Outlet 23</MenuItem>
                  <MenuItem value="Pandawa" sx={{ fontSize: '0.875rem' }}>Pandawa</MenuItem>
                  <MenuItem value="Mizu" sx={{ fontSize: '0.875rem' }}>Mizu</MenuItem>
                  <MenuItem value="Liquid" sx={{ fontSize: '0.875rem' }}>Liquid</MenuItem>
                  <MenuItem value="Helen" sx={{ fontSize: '0.875rem' }}>Helen</MenuItem>
                  <MenuItem value="Southgate" sx={{ fontSize: '0.875rem' }}>Southgate</MenuItem>
                  <MenuItem value="KulkasBabe" sx={{ fontSize: '0.875rem' }}>KulkasBabe</MenuItem>
                </Select>
              </FormControl>
              <FormHelperText error={Boolean(touched.financialType && errors.financialType)} sx={{ fontSize: '0.75rem' }}>
                {touched.financialType && errors.financialType}
              </FormHelperText>
            </Box>

            {/* Rekening Penagihan */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                Rekening Penagihan<span style={{ color: "red" }}> *</span>
              </Typography>
              <FormControl fullWidth required>
                <Select
                  size="small"
                  {...getFieldProps("billingAccount")}
                  onChange={(e) => setFieldValue("billingAccount", e.target.value)}
                  error={Boolean(touched.billingAccount && errors.billingAccount)}
                  displayEmpty
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                    Pilih Rekening Penagihan
                  </MenuItem>
                  <MenuItem value="Pandawa" sx={{ fontSize: '0.875rem' }}>Pandawa</MenuItem>
                  <MenuItem value="Outlet 23" sx={{ fontSize: '0.875rem' }}>Outlet 23</MenuItem>
                  <MenuItem value="Mizu" sx={{ fontSize: '0.875rem' }}>Mizu</MenuItem>
                  <MenuItem value="Liquid" sx={{ fontSize: '0.875rem' }}>Liquid</MenuItem>
                  <MenuItem value="Helen" sx={{ fontSize: '0.875rem' }}>Helen</MenuItem>
                  <MenuItem value="Southgate" sx={{ fontSize: '0.875rem' }}>Southgate</MenuItem>
                  <MenuItem value="KulkasBabe" sx={{ fontSize: '0.875rem' }}>KulkasBabe</MenuItem>
                </Select>
              </FormControl>
              <FormHelperText error={Boolean(touched.billingAccount && errors.billingAccount)} sx={{ fontSize: '0.75rem' }}>
                {touched.billingAccount && errors.billingAccount}
              </FormHelperText>
            </Box>
          </Box>
        </Box>

        {/* PIC Section */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            PIC
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {/* Nama PIC */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* Email */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* No Telepon */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* Username */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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

            {/* Password */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
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
        </Box>
      </Box>

      {/* Right Column: Aplikasi */}
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Aplikasi
        </Typography>

        {/* Homepage */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
            Homepage<span style={{ color: "red" }}> *</span>
          </Typography>
          <FormControl fullWidth required>
            <Select
              size="small"
              {...getFieldProps("homepage")}
              onChange={(e) => setFieldValue("homepage", e.target.value)}
              error={Boolean(touched.homepage && errors.homepage)}
              displayEmpty
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                Pilih Homepage
              </MenuItem>
              <MenuItem value="D-wallet" sx={{ fontSize: '0.875rem' }}>D-wallet</MenuItem>
              <MenuItem value="Dashboard" sx={{ fontSize: '0.875rem' }}>Dashboard</MenuItem>
              <MenuItem value="Transaksi" sx={{ fontSize: '0.875rem' }}>Transaksi</MenuItem>
              <MenuItem value="Laporan" sx={{ fontSize: '0.875rem' }}>Laporan</MenuItem>
              <MenuItem value="Pengaturan" sx={{ fontSize: '0.875rem' }}>Pengaturan</MenuItem>
              <MenuItem value="Manajemen" sx={{ fontSize: '0.875rem' }}>Manajemen</MenuItem>
              <MenuItem value="Keuangan" sx={{ fontSize: '0.875rem' }}>Keuangan</MenuItem>
              <MenuItem value="Pengguna" sx={{ fontSize: '0.875rem' }}>Pengguna</MenuItem>
            </Select>
          </FormControl>
          <FormHelperText error={Boolean(touched.homepage && errors.homepage)} sx={{ fontSize: '0.75rem' }}>
            {touched.homepage && errors.homepage}
          </FormHelperText>
        </Box>

        {/* Menu Perusahaan */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem' }}>
            Menu Perusahaan
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
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
                      fontSize: '0.875rem',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
