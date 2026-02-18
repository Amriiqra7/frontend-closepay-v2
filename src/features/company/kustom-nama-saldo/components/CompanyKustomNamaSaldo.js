'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { Edit } from 'iconsax-react';
import MainCard from '@/shared/ui/MainCard';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import { handleUpdateWithToast } from '@/shared/utils/toast';
import EditKustomNamaSaldoDialog from './EditKustomNamaSaldoDialog';

// Mock data - replace with actual API call
const mockSaldoData = [
  {
    id: 1,
    kodeSaldo: 'CLOSEPAY',
    namaSaldoDefault: 'Saldo Utama',
    namaSaldoKustom: '',
  },
  // Add more mock data as needed
];

export default function CompanyKustomNamaSaldo() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const { selectedCompany } = useAdminMenu();
  const companyName = selectedCompany?.nama || companyId || 'Perusahaan';

  const [saldoList, setSaldoList] = useState(mockSaldoData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSaldo, setSelectedSaldo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNamaDefault, setFilterNamaDefault] = useState('');
  const [filterKodeSaldo, setFilterKodeSaldo] = useState('');

  const handleToggleFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowFilters(nextOpen);
    } else {
      setShowFilters((prev) => !prev);
    }
  }, []);

  const handleResetFilter = useCallback(() => {
    setFilterNamaDefault('');
    setFilterKodeSaldo('');
  }, []);

  const hasActiveFilters = useMemo(
    () => filterNamaDefault || filterKodeSaldo,
    [filterNamaDefault, filterKodeSaldo]
  );

  // Filter data berdasarkan nama default dan kode saldo
  const filteredSaldoList = useMemo(() => {
    return saldoList.filter((saldo) => {
      const matchesNamaDefault = !filterNamaDefault || 
        saldo.namaSaldoDefault.toLowerCase().includes(filterNamaDefault.toLowerCase());
      const matchesKodeSaldo = !filterKodeSaldo || 
        saldo.kodeSaldo.toLowerCase().includes(filterKodeSaldo.toLowerCase());
      return matchesNamaDefault && matchesKodeSaldo;
    });
  }, [saldoList, filterNamaDefault, filterKodeSaldo]);

  const handleEdit = (saldo) => {
    setSelectedSaldo(saldo);
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedSaldo(null);
  };

  const handleSave = async (updatedSaldo) => {
    try {
      // TODO: Replace with actual API call
      // const updatePromise = KustomNamaSaldoAPI.update(companyId, updatedSaldo.id, {
      //   namaSaldoKustom: updatedSaldo.namaSaldoKustom,
      // });

      // Simulate API call
      const updatePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Updating kustom nama saldo:', {
            companyId,
            saldoId: updatedSaldo.id,
            namaSaldoKustom: updatedSaldo.namaSaldoKustom,
          });
          // Simulate random error for testing (remove in production)
          if (Math.random() > 0.1) {
            resolve({ success: true, data: updatedSaldo });
          } else {
            reject(new Error('Gagal memperbarui data'));
          }
        }, 1000);
      });

      await handleUpdateWithToast(
        updatePromise,
        'kustom nama saldo'
      );

      // Update local state only on success
      setSaldoList(saldoList.map(saldo => 
        saldo.id === updatedSaldo.id 
          ? { ...saldo, namaSaldoKustom: updatedSaldo.namaSaldoKustom }
          : saldo
      ));
      
      // Close dialog only after successful update
      handleCloseDialog();
    } catch (err) {
      // Error already handled by toast
      // Dialog remains open on error so user can retry
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.6 }}>
              Berikut daftar saldo yang digunakan pada perusahaan <strong>{companyName}</strong> saat ini, Anda dapat mengatur nama dari saldo yang ada. Pengaturan ini akan <strong>diterapkan hanya pada</strong> perusahaan ini dan akan <strong>berdampak pada nama dari saldo yang muncul pada member</strong> perusahaan ini.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Jika <strong>tidak ada kustom nama saldo</strong>, nama dari saldo yang akan diterapkan pada perusahaan ini adalah <strong>nama saldo default</strong>.
            </Typography>
          </Box>

          {/* Filter */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <FilterButton
              open={showFilters}
              onToggle={handleToggleFilters}
              hasActiveFilters={hasActiveFilters}
              onReset={handleResetFilter}
            />
          </Box>

          {/* Filter Collapse */}
          <FilterCollapse
            open={showFilters}
            onToggle={handleToggleFilters}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilter}
            buttonText="Filters"
            showLabel={false}
            hideHeader
            containerSx={{
              mb: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cari Nama Default"
                  value={filterNamaDefault}
                  onChange={(e) => setFilterNamaDefault(e.target.value)}
                  placeholder="Masukkan nama saldo default"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cari Kode Saldo"
                  value={filterKodeSaldo}
                  onChange={(e) => setFilterKodeSaldo(e.target.value)}
                  placeholder="Masukkan kode saldo"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </FilterCollapse>

          {/* Table */}
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>No</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Nama Saldo Default</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Nama Saldo Kustom</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Kode Saldo</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSaldoList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
                      Belum ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSaldoList.map((saldo, index) => (
                    <TableRow key={saldo.id}>
                      <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>{saldo.namaSaldoDefault}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>
                        {saldo.namaSaldoKustom || '-'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>{saldo.kodeSaldo}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(saldo)}
                          sx={{
                            color: 'warning.main',
                            '&:hover': {
                              bgcolor: 'warning.lighter',
                            },
                          }}
                        >
                          <Edit size={18} color="currentColor" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
                 </Paper>

                 {/* Button Kembali */}
                 <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                   <Button
                     variant="outlined"
                     onClick={() => router.back()}
                     sx={{
                       textTransform: 'none',
                       color: 'error.main',
                       borderColor: 'error.main',
                       px: 3,
                       '&:hover': {
                         borderColor: 'error.main',
                         bgcolor: 'error.lighter',
                       },
                     }}
                   >
                     Kembali
                   </Button>
                 </Box>
               </Box>
             </MainCard>

             {/* Dialog Edit Kustom Nama Saldo */}
      <EditKustomNamaSaldoDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        saldo={selectedSaldo}
        onSave={handleSave}
      />
    </Box>
  );
}
