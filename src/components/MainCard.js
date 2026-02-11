import React from 'react';
import { Card, CardContent } from '@mui/material';

export default function MainCard({ children, content = true, ...other }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        boxShadow: 0,
        ...other.sx,
      }}
      {...other}
    >
      {content && <CardContent>{children}</CardContent>}
      {!content && children}
    </Card>
  );
}
