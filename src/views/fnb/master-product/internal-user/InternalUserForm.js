"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Autocomplete, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { Eye, EyeSlash } from "iconsax-react";
import { fnbInternalUser } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";
import SimpleSwitchField from "../../common/SimpleSwitchField";

const ROLES = ["KITCHEN", "STAFF", "KIOSK"];
const reqMark = <Box component="span" sx={{ color: "#dc2626" }}> *</Box>;
const labelSx = { color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 0.75 };

export default function InternalUserForm({ mode = "create", userId }) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", username: "", noId: "", password: "", roles: [], isActive: true });

  const { data: detailResponse, error: detailError } = useSWR(
    isEdit && userId ? ["fnb-internal-user-detail-edit", userId] : null,
    () => fnbInternalUser.getById(userId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    if (detailError) showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail internal user."));
  }, [detailError]);

  React.useEffect(() => {
    if (!isEdit) return;
    const data = detailResponse?.data || {};
    setForm((prev) => ({ ...prev, name: data?.name || "", username: data?.username || "", noId: data?.noId || "", roles: Array.isArray(data?.roles) ? data.roles : [], isActive: Boolean(data?.isActive) }));
  }, [isEdit, detailResponse]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.username.trim() || !form.noId.trim() || form.roles.length === 0) return;
    if (!isEdit && (!form.password.trim() || form.password.length < 8)) return;
    if (isEdit && form.password && form.password.length < 8) return;

    setIsSubmitting(true);
    try {
      const payload = { name: form.name.trim(), username: form.username.trim(), noId: form.noId.trim(), roles: form.roles, isActive: form.isActive };
      if (form.password.trim()) payload.password = form.password;
      await toastPromise(
        isEdit ? fnbInternalUser.update(userId, payload) : fnbInternalUser.create(payload),
        {
          loading: "Menyimpan internal user...",
          success: isEdit ? "Internal user berhasil diperbarui." : "Internal user berhasil dibuat.",
          error: (error) => getApiErrorMessage(error, isEdit ? "Gagal memperbarui internal user." : "Gagal membuat internal user."),
        }
      );
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
            <Typography sx={labelSx}>Password{isEdit ? "" : reqMark}</Typography>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder={isEdit ? "Kosongkan jika tidak diubah" : ""}
              helperText={form.password && form.password.length < 8 ? "Minimal 8 karakter" : " "}
              error={Boolean(form.password && form.password.length < 8)}
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}</IconButton></InputAdornment> } }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
            <Typography sx={labelSx}>Roles{reqMark}</Typography>
            <Autocomplete multiple fullWidth size="small" options={ROLES} value={form.roles} onChange={(_, value) => setForm((p) => ({ ...p, roles: value || [] }))} renderInput={(params) => <TextField {...params} placeholder="Pilih roles" />} />
          </Box>
          <SimpleSwitchField
            label="Status"
            labelSx={labelSx}
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
          />
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ mt: 3 }}>
          <Button component={Link} href="/fnb/manajemen-user" variant="text">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !form.name.trim() || !form.username.trim() || !form.noId.trim() || (!isEdit && (!form.password.trim() || form.password.length < 8)) || (Boolean(form.password) && form.password.length < 8) || form.roles.length === 0} sx={{ bgcolor: "#155DFC", "&:hover": { bgcolor: "#0f4fd8" } }}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
