'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(Paper);

export default function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmColor = 'primary',
  cancelColor = 'inherit',
  children,
}) {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperComponent={MotionPaper}
          PaperProps={{
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            },
            sx: (theme) => ({
              borderRadius: 2,
              boxShadow: theme.shadows[24],
            }),
          }}
          TransitionProps={{
            timeout: 200,
          }}
        >
      {title && (
        <DialogTitle
          sx={(theme) => ({
            fontWeight: 600,
            padding: theme.spacing(2.5, 3, 1.25, 3),
          })}
        >
          {title}
        </DialogTitle>
      )}
      
      <DialogContent
        sx={(theme) => ({
          padding: theme.spacing(1.25, 3),
          ...(title && { paddingTop: theme.spacing(1.25) }),
        })}
      >
        {content && (
          typeof content === 'string' ? (
            <Typography variant="body1">
              {content}
            </Typography>
          ) : (
            content
          )
        )}
        {children}
      </DialogContent>
      
      <DialogActions
        sx={(theme) => ({
          padding: theme.spacing(1.25, 3, 2.5, 3),
          gap: theme.spacing(1),
        })}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          color={cancelColor}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color={confirmColor}
        >
          {confirmText}
        </Button>
      </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
