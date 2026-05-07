'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertDialog from '@/shared/ui/AlertDialog';

export default function ResetPasswordDialog({ open, onClose, member, onConfirm }) {
  if (!member) return null;

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Konfirmasi Reset Password"
      content={
        <Typography variant="body1">
          Apakah anda yakin akan mereset password akun induk <strong>{member.nama}</strong>?
        </Typography>
      }
      confirmText="Ya, Reset"
      cancelText="Batal"
      confirmColor="primary"
    />
  );
}
