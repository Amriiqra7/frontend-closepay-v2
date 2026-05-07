"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Autocomplete, Box, Button, IconButton, InputAdornment, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import { Eye, EyeSlash } from "iconsax-react";
import { fnbInternalUser } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";

const ROLES = ["KITCHEN", "STAFF", "KIOSK"];
const reqMark = <Box component="span" sx={{ color: "#dc2626" }}> *</Box>;
const labelSx = { color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 0.75 };

export default function EditInternalUserPage({ userId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    username: "",
    noId: "",
    password: "",
    roles: [],
    isActive: true,
  });

  const { data: detailResponse, error: detailError } = useSWR(
    userId ? ["fnb-internal-user-detail-edit", userId] : null,
    () => fnbInternalUser.getById(userId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    if (detailError) {
      showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail internal user."));
    }
  }, [detailError]);

  React.useEffect(() => {
    const data = detailResponse?.data || {};
    setForm((prev) => ({
      ...prev,
      name: data?.name || "",
      username: data?.username || "",
      noId: data?.noId || "",
      roles: Array.isArray(data?.roles) ? data.roles : [],
      isActive: Boolean(data?.isActive),
    }));
  }, [detailResponse]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.username.trim() || !form.noId.trim() || form.roles.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        noId: form.noId.trim(),
        roles: form.roles,
        isActive: form.isActive,
      };
      if (form.password.trim()) payload.password = form.password;
      await toastPromise(fnbInternalUser.update(userId, payload), {
        loading: "Menyimpan internal user...",
        success: "Internal user berhasil diperbarui.",
        error: (error) => getApiErrorMessage(error, "Gagal memperbarui internal user."),
      });
      router.push("/fnb/manajemen-user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2.5 }}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <Box>
            <Typography sx={labelSx}>Name{reqMark}</Typography>
            <TextField fullWidth size="small" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </Box>
          <Box>
            <Typography sx={labelSx}>Username{reqMark}</Typography>
            <TextField fullWidth size="small" required value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} />
          </Box>
          <Box>
            <Typography sx={labelSx}>No ID{reqMark}</Typography>
            <TextField fullWidth size="small" required value={form.noId} onChange={(e) => setForm((p) => ({ ...p, noId: e.target.value }))} />
          </Box>
          <Box>
            <Typography sx={labelSx}>Password</Typography>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Kosongkan jika tidak diubah"
              helperText={form.password && form.password.length < 8 ? "Minimal 8 karakter" : " "}
              error={Boolean(form.password && form.password.length < 8)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
            <Typography sx={labelSx}>Roles{reqMark}</Typography>
            <Autocomplete
              multiple
              fullWidth
              size="small"
              options={ROLES}
              value={form.roles}
              onChange={(_, value) => setForm((p) => ({ ...p, roles: value || [] }))}
              sx={{
                "& .MuiInputBase-input": { fontSize: "0.8125rem" },
                "& .MuiAutocomplete-tag": { fontSize: "0.75rem", height: 22 },
                "& .MuiAutocomplete-option": { fontSize: "0.8125rem" },
              }}
              slotProps={{
                paper: {
                  sx: {
                    "& .MuiAutocomplete-option": {
                      fontSize: "0.8125rem",
                      minHeight: 34,
                    },
                  },
                },
              }}
              renderInput={(params) => <TextField {...params} placeholder="Pilih roles" />}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Status</Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #e5e7eb", borderRadius: 2, px: 1.25, py: 0.5 }}>
              <Typography sx={{ color: form.isActive ? "#155DFC" : "#6b7280", fontWeight: 500, fontSize: "0.82rem" }}>
                {form.isActive ? "Aktif" : "Nonaktif"}
              </Typography>
              <Switch checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} size="small" />
            </Box>
          </Box>
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ mt: 3 }}>
          <Button component={Link} href="/fnb/manajemen-user" variant="text">Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting || !form.name.trim() || !form.username.trim() || !form.noId.trim() || (Boolean(form.password) && form.password.length < 8) || form.roles.length === 0}
            sx={{ bgcolor: "#155DFC", "&:hover": { bgcolor: "#0f4fd8" } }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

