'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import { ArrowDown2, TickCircle, Clock, CloseCircle } from 'iconsax-react';

// Sample data untuk transaksi
const transactionData = [
  {
    id: 'TRX001',
    tanggal: '12 Oktober 2025',
    member: 'Tegar Cape',
    outlet: 'Outlet 23',
    area: 'Area 21',
    nominal: 'Rp 150.000',
    status: 'success',
    statusLabel: 'Berhasil',
  },
  {
    id: 'TRX002',
    tanggal: '12 Oktober 2025',
    member: 'Ahmad Fauzi',
    outlet: 'Outlet 24',
    area: 'Area 22',
    nominal: 'Rp 200.000',
    status: 'pending',
    statusLabel: 'Pending',
  },
  {
    id: 'TRX003',
    tanggal: '11 Oktober 2025',
    member: 'Siti Nurhaliza',
    outlet: 'Outlet 23',
    area: 'Area 21',
    nominal: 'Rp 175.000',
    status: 'success',
    statusLabel: 'Berhasil',
  },
  {
    id: 'TRX004',
    tanggal: '11 Oktober 2025',
    member: 'Budi Santoso',
    outlet: 'Outlet 25',
    area: 'Area 23',
    nominal: 'Rp 100.000',
    status: 'failed',
    statusLabel: 'Gagal',
  },
  {
    id: 'TRX005',
    tanggal: '10 Oktober 2025',
    member: 'Dewi Lestari',
    outlet: 'Outlet 24',
    area: 'Area 22',
    nominal: 'Rp 300.000',
    status: 'success',
    statusLabel: 'Berhasil',
  },
];

// Sample data untuk pemesanan
const orderData = [
  {
    id: 'ORD001',
    tanggal: '12 Oktober 2025',
    nomor: 'PO-2025-001',
    outlet: 'Outlet 23',
    area: 'Area 21',
    total: 'Rp 500.000',
    status: 'completed',
    statusLabel: 'Selesai',
  },
  {
    id: 'ORD002',
    tanggal: '12 Oktober 2025',
    nomor: 'PO-2025-002',
    outlet: 'Outlet 24',
    area: 'Area 22',
    total: 'Rp 750.000',
    status: 'processing',
    statusLabel: 'Diproses',
  },
  {
    id: 'ORD003',
    tanggal: '11 Oktober 2025',
    nomor: 'PO-2025-003',
    outlet: 'Outlet 23',
    area: 'Area 21',
    total: 'Rp 400.000',
    status: 'ready',
    statusLabel: 'Siap',
  },
  {
    id: 'ORD004',
    tanggal: '11 Oktober 2025',
    nomor: 'PO-2025-004',
    outlet: 'Outlet 25',
    area: 'Area 23',
    total: 'Rp 600.000',
    status: 'new',
    statusLabel: 'Baru',
  },
  {
    id: 'ORD005',
    tanggal: '10 Oktober 2025',
    nomor: 'PO-2025-005',
    outlet: 'Outlet 24',
    area: 'Area 22',
    total: 'Rp 900.000',
    status: 'completed',
    statusLabel: 'Selesai',
  },
];

const getStatusColor = (status) => {
  const colors = {
    success: { bg: '#e8f5e9', color: '#2e7d32' },
    pending: { bg: '#fff3e0', color: '#ed6c02' },
    failed: { bg: '#ffebee', color: '#d32f2f' },
    cancelled: { bg: '#f3e5f5', color: '#9c27b0' },
    completed: { bg: '#e8f5e9', color: '#2e7d32' },
    processing: { bg: '#e3f2fd', color: '#1976d2' },
    ready: { bg: '#fff9c4', color: '#f57f17' },
    new: { bg: '#e1f5fe', color: '#0277bd' },
  };
  return colors[status] || { bg: '#f5f5f5', color: '#666' };
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'success':
    case 'completed':
      return <TickCircle size="16" color={getStatusColor(status).color} />;
    case 'pending':
    case 'processing':
    case 'ready':
    case 'new':
      return <Clock size="16" color={getStatusColor(status).color} />;
    case 'failed':
    case 'cancelled':
      return <CloseCircle size="16" color={getStatusColor(status).color} />;
    default:
      return null;
  }
};

export default function TransactionFilters() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTransactionTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            <TableCell sx={{ fontWeight: 600, color: '#000', py: 2 }}>ID Transaksi</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Tanggal</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Nama Member</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Outlet</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Area</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Nominal</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactionData.map((row) => {
            const statusStyle = getStatusColor(row.status);
            return (
              <TableRow
                key={row.id}
                sx={{
                  '&:hover': { bgcolor: '#fafafa' },
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {row.tanggal}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: '0.875rem' }}>
                      {row.member.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      {row.member}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {row.outlet}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {row.area}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                    {row.nominal}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(row.status)}
                    label={row.statusLabel}
                    size="small"
                    sx={{
                      bgcolor: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-icon': {
                        color: statusStyle.color,
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderOrderTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            <TableCell sx={{ fontWeight: 600, color: '#000', py: 2 }}>ID Pemesanan</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Nomor Pesanan</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Tanggal</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Outlet</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Area</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderData.map((row) => {
            const statusStyle = getStatusColor(row.status);
            return (
              <TableRow
                key={row.id}
                sx={{
                  '&:hover': { bgcolor: '#fafafa' },
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row.nomor}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {row.tanggal}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {row.outlet}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {row.area}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                    {row.total}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(row.status)}
                    label={row.statusLabel}
                    size="small"
                    sx={{
                      bgcolor: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-icon': {
                        color: statusStyle.color,
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 3, 
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ px: 2.5, pt: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: '#666',
                '&.Mui-selected': {
                  color: '#1976d2',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="Transaksi" />
            <Tab label="Pemesanan" />
          </Tabs>
        </Box>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? renderTransactionTable() : renderOrderTable()}
        </Box>
      </CardContent>
    </Card>
  );
}
