'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import MainCard from '@/shared/ui/MainCard';

// Dynamic import untuk menghindari SSR issues dengan ApexCharts
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MotionPaper = motion(Paper);

export default function JumlahEmailZeptoList() {
  const [tersedia, setTersedia] = useState(460000);
  const [digunakan, setDigunakan] = useState(3273);
  const [tersisa, setTersisa] = useState(456727);

  const [updateDialog, setUpdateDialog] = useState({
    open: false,
    tersedia: '',
    tersisa: '',
  });

  const handleOpenUpdateDialog = useCallback(() => {
    setUpdateDialog({
      open: true,
      tersedia: tersedia.toLocaleString('id-ID'),
      tersisa: tersisa.toLocaleString('id-ID'),
    });
  }, [tersedia, tersisa]);

  const handleCloseUpdateDialog = useCallback(() => {
    setUpdateDialog({ open: false, tersedia: '', tersisa: '' });
  }, []);

  const handleUpdate = useCallback(() => {
    // TODO: Implement API call to update
    const newTersedia = parseInt(updateDialog.tersedia.replace(/\./g, '')) || tersedia;
    const newTersisa = parseInt(updateDialog.tersisa.replace(/\./g, '')) || tersisa;
    const newDigunakan = newTersedia - newTersisa;

    setTersedia(newTersedia);
    setTersisa(newTersisa);
    setDigunakan(newDigunakan);
    handleCloseUpdateDialog();
  }, [updateDialog, tersedia, tersisa, handleCloseUpdateDialog]);

  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false,
      },
      fontFamily: 'inherit',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff'],
    },
    colors: ['#9c27b0', '#00bcd4'],
    labels: ['Digunakan', 'Tersisa'],
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString('id-ID');
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.1,
        },
      },
    },
  };

  const chartSeries = [digunakan, tersisa];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        <MainCard content={false}>
          <Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' }, mb: 3, gap: { xs: 2, sm: 0 } }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Jumlah Email Zepto
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Ringkasan Jumlah dan Klasifikasi Email Zepto
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleOpenUpdateDialog}
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                textTransform: 'none',
                alignSelf: { xs: 'flex-start', sm: 'auto' },
                '&:hover': {
                  bgcolor: '#f57c00',
                },
              }}
            >
              Update
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 }, alignItems: { xs: 'center', md: 'center' } }}>
            {/* Chart di sebelah kiri */}
            <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: 'auto' }, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: { xs: '100%', sm: 300 }, height: { xs: 250, sm: 300 }, maxWidth: 300 }}>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  height="100%"
                />
              </Box>
            </Box>

            {/* Info di sebelah kanan */}
            <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  Tersedia
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {tersedia.toLocaleString('id-ID')}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#9c27b0',
                    }}
                  />
                  <Typography variant="body2">Digunakan</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {digunakan.toLocaleString('id-ID')}
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#00bcd4',
                    }}
                  />
                  <Typography variant="body2">Tersisa</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {tersisa.toLocaleString('id-ID')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        </MainCard>
      </Box>

      {/* Update Dialog */}
      <AnimatePresence>
        {updateDialog.open && (
          <Dialog
            open={updateDialog.open}
            onClose={handleCloseUpdateDialog}
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
            <DialogTitle
              sx={(theme) => ({
                fontWeight: 600,
                padding: theme.spacing(2.5, 3, 1.25, 3),
              })}
            >
              Ubah Jumlah Email
            </DialogTitle>
            <DialogContent
              sx={(theme) => ({
                padding: theme.spacing(1.25, 3),
              })}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Tersedia
                </Typography>
                <TextField
                  fullWidth
                  value={updateDialog.tersedia}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (value) {
                      const formatted = parseInt(value).toLocaleString('id-ID');
                      setUpdateDialog((prev) => ({ ...prev, tersedia: formatted }));
                    } else {
                      setUpdateDialog((prev) => ({ ...prev, tersedia: '' }));
                    }
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Tersisa
                </Typography>
                <TextField
                  fullWidth
                  value={updateDialog.tersisa}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (value) {
                      const formatted = parseInt(value).toLocaleString('id-ID');
                      setUpdateDialog((prev) => ({ ...prev, tersisa: formatted }));
                    } else {
                      setUpdateDialog((prev) => ({ ...prev, tersisa: '' }));
                    }
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions
              sx={(theme) => ({
                padding: theme.spacing(1.25, 3, 2.5, 3),
                gap: theme.spacing(1),
              })}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleCloseUpdateDialog}
                sx={{
                  textTransform: 'none',
                }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{
                  textTransform: 'none',
                }}
              >
                Simpan
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
