import React from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      startIcon={loading ? <CircularProgress size={16} /> : props.startIcon}
    >
      {children}
    </Button>
  );
}
