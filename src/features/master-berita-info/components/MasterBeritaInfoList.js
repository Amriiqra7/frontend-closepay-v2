'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Edit, Trash, Add, Eye } from 'iconsax-react';
import FilterCollapse, { FilterButton } from '@/shared/ui/FilterCollapse';
import { handleDeleteWithToast, handleCreateWithToast, handleUpdateWithToast } from '@/shared/utils/toast';
import BeritaFormDialog from './BeritaFormDialog';
import BeritaDetailDialog from './BeritaDetailDialog';
import InfoFormDialog from './InfoFormDialog';
import InfoDetailDialog from './InfoDetailDialog';
import AlertDialog from '@/shared/ui/AlertDialog';
import TablePagination from '@/shared/ui/TablePagination';

// Mock data berita
const mockBeritaData = [
  {
    id: 1,
    judul: 'Pengumuman Sistem Maintenance',
    subJudul: 'Maintenance akan dilakukan pada tanggal tertentu',
    isiBerita: 'Sistem akan melakukan maintenance pada tanggal tertentu. Mohon untuk menyimpan pekerjaan Anda terlebih dahulu.',
    jenisUserPenerima: 'ADMIN',
    perusahaanTujuan: ['Bougenvile Blok', 'Kantin FKi 12'],
    gambar: null,
    publikasikan: true,
    jadikanBeritaUtama: true,
    tags: ['Maintenance', 'Sistem'],
    statusPublikasi: 'Dipublikasikan',
    statusBeritaUtama: 'Ya',
  },
  {
    id: 2,
    judul: 'Update Fitur Baru',
    subJudul: 'Fitur baru telah ditambahkan',
    isiBerita: 'Beberapa fitur baru telah ditambahkan ke dalam sistem. Silakan cek menu terbaru.',
    jenisUserPenerima: 'ADMIN',
    perusahaanTujuan: ['Bougenvile Blok'],
    gambar: null,
    publikasikan: false,
    jadikanBeritaUtama: false,
    tags: ['Update', 'Fitur'],
    statusPublikasi: 'Tidak dipublikasikan',
    statusBeritaUtama: 'Tidak',
  },
];

// Mock data info
const mockInfoData = [
  {
    id: 1,
    judul: 'Info Penting untuk Admin',
    jenisUserPenerima: 'ADMIN',
    perusahaanTujuan: ['Bougenvile Blok', 'Kantin FKi 12'],
    linkTujuan: 'https://example.com',
    gambar: null,
    tanggalMulai: '2024-01-15',
    tanggalSelesai: '2024-01-20',
    waktuMulai: '08:00',
    waktuSelesai: '17:00',
    opsiLewati: true,
    rekomendasikanTiapHari: false,
  },
  {
    id: 2,
    judul: 'Panduan Penggunaan Sistem',
    jenisUserPenerima: 'ADMIN',
    perusahaanTujuan: ['Kantin FKi 12'],
    linkTujuan: 'https://example.com/panduan',
    gambar: null,
    tanggalMulai: '2024-02-01',
    tanggalSelesai: '2024-02-28',
    waktuMulai: '09:00',
    waktuSelesai: '18:00',
    opsiLewati: false,
    rekomendasikanTiapHari: true,
  },
];

// Mock perusahaan options
const mockPerusahaanOptions = [
  'Bougenvile Blok',
  'Kantin FKi 12',
  'Perusahaan A',
  'Perusahaan B',
];

export default function MasterBeritaInfoList() {
  const [activeTab, setActiveTab] = useState(0);
  const [beritaList, setBeritaList] = useState(mockBeritaData);
  const [infoList, setInfoList] = useState(mockInfoData);
  
  // Berita states
  const [beritaDialogOpen, setBeritaDialogOpen] = useState(false);
  const [beritaDetailDialogOpen, setBeritaDetailDialogOpen] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [beritaDeleteDialog, setBeritaDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [showBeritaFilters, setShowBeritaFilters] = useState(false);
  const [filterBeritaNama, setFilterBeritaNama] = useState('');
  const [filterBeritaStatusPublikasi, setFilterBeritaStatusPublikasi] = useState('');
  const [filterBeritaStatusUtama, setFilterBeritaStatusUtama] = useState('');
  
  // Info states
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDetailDialogOpen, setInfoDetailDialogOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [infoDeleteDialog, setInfoDeleteDialog] = useState({ open: false, id: null, name: '' });
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  // Berita handlers
  const handleToggleBeritaFilters = useCallback((nextOpen) => {
    if (typeof nextOpen === 'boolean') {
      setShowBeritaFilters(nextOpen);
    } else {
      setShowBeritaFilters((prev) => !prev);
    }
  }, []);

  const handleResetBeritaFilter = useCallback(() => {
    setFilterBeritaNama('');
    setFilterBeritaStatusPublikasi('');
    setFilterBeritaStatusUtama('');
  }, []);

  const hasActiveBeritaFilters = useMemo(
    () => filterBeritaNama || filterBeritaStatusPublikasi || filterBeritaStatusUtama,
    [filterBeritaNama, filterBeritaStatusPublikasi, filterBeritaStatusUtama]
  );

  const filteredBeritaList = useMemo(() => {
    return beritaList.filter((item) => {
      const matchesNama = !filterBeritaNama ||
        item.judul.toLowerCase().includes(filterBeritaNama.toLowerCase());
      const matchesPublikasi = !filterBeritaStatusPublikasi ||
        item.statusPublikasi === filterBeritaStatusPublikasi;
      const matchesUtama = !filterBeritaStatusUtama ||
        item.statusBeritaUtama === filterBeritaStatusUtama;
      return matchesNama && matchesPublikasi && matchesUtama;
    });
  }, [beritaList, filterBeritaNama, filterBeritaStatusPublikasi, filterBeritaStatusUtama]);

  const handleTambahBerita = () => {
    setSelectedBerita(null);
    setBeritaDialogOpen(true);
  };

  const handleEditBerita = (berita) => {
    setSelectedBerita(berita);
    setBeritaDialogOpen(true);
  };

  const handleDetailBerita = (berita) => {
    setSelectedBerita(berita);
    setBeritaDetailDialogOpen(true);
  };

  const handleDeleteBerita = (berita) => {
    setBeritaDeleteDialog({
      open: true,
      id: berita.id,
      name: berita.judul,
    });
  };

  const handleConfirmDeleteBerita = async () => {
    try {
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Deleting berita:', beritaDeleteDialog.id);
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Berita',
        beritaDeleteDialog.name
      );

      setBeritaList((prev) =>
        prev.filter((item) => item.id !== beritaDeleteDialog.id)
      );
      setBeritaDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setBeritaDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleCloseBeritaDialog = () => {
    setBeritaDialogOpen(false);
    setSelectedBerita(null);
  };

  const handleSaveBerita = async (data) => {
    try {
      const savePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Saving berita:', data);
          if (Math.random() > 0.1) {
            resolve({ success: true, data });
          } else {
            reject(new Error('Gagal menyimpan data'));
          }
        }, 1000);
      });

      // Calculate status for display
      const statusData = {
        ...data,
        statusPublikasi: data.publikasikan ? 'Dipublikasikan' : 'Tidak dipublikasikan',
        statusBeritaUtama: data.jadikanBeritaUtama ? 'Ya' : 'Tidak',
      };

      if (selectedBerita) {
        await handleUpdateWithToast(savePromise, 'berita');
        setBeritaList((prev) =>
          prev.map((item) =>
            item.id === selectedBerita.id ? { ...statusData, id: selectedBerita.id } : item
          )
        );
      } else {
        await handleCreateWithToast(savePromise, 'berita');
        const newId = Math.max(...beritaList.map((item) => item.id), 0) + 1;
        setBeritaList((prev) => [...prev, { ...statusData, id: newId }]);
      }

      handleCloseBeritaDialog();
    } catch (err) {
      // Error already handled by toast
    }
  };

  // Info handlers
  const handleTambahInfo = () => {
    setSelectedInfo(null);
    setInfoDialogOpen(true);
  };

  const handleEditInfo = (info) => {
    setSelectedInfo(info);
    setInfoDialogOpen(true);
  };

  const handleDetailInfo = (info) => {
    setSelectedInfo(info);
    setInfoDetailDialogOpen(true);
  };

  const handleDeleteInfo = (info) => {
    setInfoDeleteDialog({
      open: true,
      id: info.id,
      name: info.judul,
    });
  };

  const handleConfirmDeleteInfo = async () => {
    try {
      const deletePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Deleting info:', infoDeleteDialog.id);
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('Gagal menghapus data'));
          }
        }, 1000);
      });

      await handleDeleteWithToast(
        deletePromise,
        'Info',
        infoDeleteDialog.name
      );

      setInfoList((prev) =>
        prev.filter((item) => item.id !== infoDeleteDialog.id)
      );
      setInfoDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setInfoDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    setSelectedInfo(null);
  };

  const handleSaveInfo = async (data) => {
    try {
      const savePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Saving info:', data);
          if (Math.random() > 0.1) {
            resolve({ success: true, data });
          } else {
            reject(new Error('Gagal menyimpan data'));
          }
        }, 1000);
      });

      if (selectedInfo) {
        await handleUpdateWithToast(savePromise, 'info');
        setInfoList((prev) =>
          prev.map((item) =>
            item.id === selectedInfo.id ? { ...data, id: selectedInfo.id } : item
          )
        );
      } else {
        await handleCreateWithToast(savePromise, 'info');
        const newId = Math.max(...infoList.map((item) => item.id), 0) + 1;
        setInfoList((prev) => [...prev, { ...data, id: newId }]);
      }

      handleCloseInfoDialog();
    } catch (err) {
      // Error already handled by toast
    }
  };

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  // Berita columns
  const beritaColumns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'NO',
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'judul',
        header: 'Nama Berita',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'perusahaanTujuan',
        header: 'Perusahaan Tujuan',
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            {Array.isArray(cell.getValue()) ? cell.getValue().join(', ') : cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'statusPublikasi',
        header: 'Status Publikasi',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'statusBeritaUtama',
        header: 'Status Berita Utama',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
    ],
    []
  );

  // Info columns
  const infoColumns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'NO',
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <Typography variant="body2" align="center">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'judul',
        header: 'Nama Info',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tanggalMulai',
        header: 'Tanggal Mulai',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'tanggalSelesai',
        header: 'Tanggal Selesai',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'waktuMulai',
        header: 'Waktu Mulai',
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'waktuSelesai',
        header: 'Waktu Selesai',
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
    ],
    []
  );

  // Sort and paginate berita
  const sortedBeritaData = useMemo(() => {
    if (sorting.length === 0) return filteredBeritaList;
    const sorted = [...filteredBeritaList];
    const sort = sorting[0];
    sorted.sort((a, b) => {
      const aVal = a[sort.id] || '';
      const bVal = b[sort.id] || '';
      if (sort.desc) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    return sorted;
  }, [filteredBeritaList, sorting]);

  const paginatedBeritaData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedBeritaData.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [sortedBeritaData, pagination]);

  // Sort and paginate info
  const sortedInfoData = useMemo(() => {
    if (sorting.length === 0) return infoList;
    const sorted = [...infoList];
    const sort = sorting[0];
    sorted.sort((a, b) => {
      const aVal = a[sort.id] || '';
      const bVal = b[sort.id] || '';
      if (sort.desc) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    return sorted;
  }, [infoList, sorting]);

  const paginatedInfoData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedInfoData.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index + 1,
    }));
  }, [sortedInfoData, pagination]);

  // Berita table config
  const beritaTable = useMaterialReactTable({
    columns: beritaColumns,
    data: paginatedBeritaData,
    getRowId: (row) => row.id.toString(),
    rowCount: sortedBeritaData.length,
    state: {
      isLoading: false,
      pagination,
      sorting,
    },
    initialState: {
      density: 'compact',
    },
    enableRowNumbers: false,
    enableRowActions: true,
    enableSorting: true,
    enableEditing: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: true,
    enableTopToolbar: false,
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    positionActionsColumn: 'last',
    onSortingChange: setSorting,
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: '12px !important',
        backgroundColor: 'rgba(248, 249, 250, 1)',
        borderTop: '1px solid rgba(232, 235, 238, 1) !important',
        borderBottom: '2px solid rgba(232, 235, 238, 1) !important',
        '& .MuiTableSortLabel-icon, & .MuiIconButton-root, & .MuiBadge-root': {
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        '&:hover .MuiTableSortLabel-icon, &:hover .MuiIconButton-root, &:hover .MuiBadge-root': {
          opacity: 1,
        },
        '& .MuiTableSortLabel-active .MuiTableSortLabel-icon': {
          opacity: 1,
        },
      }),
    },
    muiTableBodyCellProps: {
      sx: { fontSize: '12px !important' },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(even)': {
          backgroundColor: 'rgba(248, 249, 250, 1) !important',
        },
      }),
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        mb: 4,
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: 'rgba(255, 255, 255, 1)',
    }),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
        muiTableHeadCellProps: { align: 'left' },
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        display="flex"
        gap={0.5}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => handleEditBerita(row.original)}
            sx={{
              color: '#ed6c02',
              '&:hover': {
                bgcolor: 'rgba(237, 108, 2, 0.08)',
              },
            }}
          >
            <Edit size={20} variant="Linear" color="#ed6c02" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Detail" arrow>
          <IconButton
            size="small"
            onClick={() => handleDetailBerita(row.original)}
            sx={{
              color: '#1976d2',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <Eye size={20} variant="Linear" color="#1976d2" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus" arrow>
          <IconButton
            size="small"
            onClick={() => handleDeleteBerita(row.original)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            <Trash size={20} variant="Linear" color="#d32f2f" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={sortedBeritaData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    ),
  });

  // Info table config
  const infoTable = useMaterialReactTable({
    columns: infoColumns,
    data: paginatedInfoData,
    getRowId: (row) => row.id.toString(),
    rowCount: sortedInfoData.length,
    state: {
      isLoading: false,
      pagination,
      sorting,
    },
    initialState: {
      density: 'compact',
    },
    enableRowNumbers: false,
    enableRowActions: true,
    enableSorting: true,
    enableEditing: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: true,
    enableTopToolbar: false,
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    positionActionsColumn: 'last',
    onSortingChange: setSorting,
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: '12px !important',
        backgroundColor: 'rgba(248, 249, 250, 1)',
        borderTop: '1px solid rgba(232, 235, 238, 1) !important',
        borderBottom: '2px solid rgba(232, 235, 238, 1) !important',
        '& .MuiTableSortLabel-icon, & .MuiIconButton-root, & .MuiBadge-root': {
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        '&:hover .MuiTableSortLabel-icon, &:hover .MuiIconButton-root, &:hover .MuiBadge-root': {
          opacity: 1,
        },
        '& .MuiTableSortLabel-active .MuiTableSortLabel-icon': {
          opacity: 1,
        },
      }),
    },
    muiTableBodyCellProps: {
      sx: { fontSize: '12px !important' },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(even)': {
          backgroundColor: 'rgba(248, 249, 250, 1) !important',
        },
      }),
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        mb: 4,
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: 'rgba(255, 255, 255, 1)',
    }),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aksi',
        muiTableHeadCellProps: { align: 'left' },
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        display="flex"
        gap={0.5}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => handleEditInfo(row.original)}
            sx={{
              color: '#ed6c02',
              '&:hover': {
                bgcolor: 'rgba(237, 108, 2, 0.08)',
              },
            }}
          >
            <Edit size={20} variant="Linear" color="#ed6c02" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Detail" arrow>
          <IconButton
            size="small"
            onClick={() => handleDetailInfo(row.original)}
            sx={{
              color: '#1976d2',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <Eye size={20} variant="Linear" color="#1976d2" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus" arrow>
          <IconButton
            size="small"
            onClick={() => handleDeleteInfo(row.original)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            <Trash size={20} variant="Linear" color="#d32f2f" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={sortedInfoData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    ),
  });

  return (
    <>
      <Box sx={{ width: '100%', height: '100%' }}>
        {/* Tabs */}
        <Box sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'white' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: 'text.secondary',
                px: 2,
                '&.Mui-selected': {
                  color: '#155DFC',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: '#155DFC',
              },
            }}
          >
            <Tab label="BERITA" value={0} />
            <Tab label="INFO" value={1} />
          </Tabs>
        </Box>

        {/* Berita Tab Content */}
        {activeTab === 0 && (
          <>
            {/* Toolbar dengan tombol Filter dan Tambah */}
            <Box
              sx={{
                p: 2,
                pt: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                columnGap: 1.5,
                rowGap: 1.5,
                backgroundColor: 'white',
                borderBottom: '1px solid rgba(232, 235, 238, 1)',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <FilterButton
                  open={showBeritaFilters}
                  onToggle={handleToggleBeritaFilters}
                  hasActiveFilters={hasActiveBeritaFilters}
                  onReset={handleResetBeritaFilter}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Add size={20} color="white" />}
                  onClick={handleTambahBerita}
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  Tambah
                </Button>
              </Box>
            </Box>

            {/* FilterCollapse untuk input filter */}
            <FilterCollapse
              open={showBeritaFilters}
              onToggle={handleToggleBeritaFilters}
              hasActiveFilters={hasActiveBeritaFilters}
              onReset={handleResetBeritaFilter}
              buttonText="Filters"
              showLabel={false}
              hideHeader
              containerSx={{
                p: 2,
                border: 'none',
                backgroundColor: 'white',
                borderBottom: '1px solid rgba(232, 235, 238, 1)',
                mt: 0,
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Cari Nama Berita
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Cari nama berita..."
                    value={filterBeritaNama}
                    onChange={(e) => setFilterBeritaNama(e.target.value)}
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
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Status Publikasi
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filterBeritaStatusPublikasi}
                      onChange={(e) => setFilterBeritaStatusPublikasi(e.target.value)}
                      displayEmpty
                      sx={{
                        fontSize: '0.875rem',
                      }}
                    >
                      <MenuItem value="">Semua</MenuItem>
                      <MenuItem value="Dipublikasikan">Dipublikasikan</MenuItem>
                      <MenuItem value="Tidak dipublikasikan">Tidak dipublikasikan</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Status Berita Utama
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filterBeritaStatusUtama}
                      onChange={(e) => setFilterBeritaStatusUtama(e.target.value)}
                      displayEmpty
                      sx={{
                        fontSize: '0.875rem',
                      }}
                    >
                      <MenuItem value="">Semua</MenuItem>
                      <MenuItem value="Ya">Ya</MenuItem>
                      <MenuItem value="Tidak">Tidak</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </FilterCollapse>

            {/* MaterialReactTable */}
            <Box sx={{ pb: 4 }}>
              <MaterialReactTable table={beritaTable} />
            </Box>
          </>
        )}

        {/* Info Tab Content */}
        {activeTab === 1 && (
          <>
            {/* Toolbar dengan tombol Tambah */}
            <Box
              sx={{
                p: 2,
                pt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'white',
                borderBottom: '1px solid rgba(232, 235, 238, 1)',
              }}
            >
              <Button
                variant="contained"
                startIcon={<Add size={20} color="white" />}
                onClick={handleTambahInfo}
                sx={{
                  textTransform: 'none',
                }}
              >
                Tambah
              </Button>
            </Box>

            {/* MaterialReactTable */}
            <Box sx={{ pb: 4 }}>
              <MaterialReactTable table={infoTable} />
            </Box>
          </>
        )}
      </Box>

      {/* Berita Dialogs */}
      <BeritaFormDialog
        open={beritaDialogOpen}
        onClose={handleCloseBeritaDialog}
        onSave={handleSaveBerita}
        data={selectedBerita}
        perusahaanOptions={mockPerusahaanOptions}
      />

      <BeritaDetailDialog
        open={beritaDetailDialogOpen}
        onClose={() => {
          setBeritaDetailDialogOpen(false);
          setSelectedBerita(null);
        }}
        data={selectedBerita}
        perusahaanOptions={mockPerusahaanOptions}
      />

      <AlertDialog
        open={beritaDeleteDialog.open}
        onClose={() => setBeritaDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleConfirmDeleteBerita}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus <strong>{beritaDeleteDialog.name}</strong>?
          </Typography>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />

      {/* Info Dialogs */}
      <InfoFormDialog
        open={infoDialogOpen}
        onClose={handleCloseInfoDialog}
        onSave={handleSaveInfo}
        data={selectedInfo}
        perusahaanOptions={mockPerusahaanOptions}
      />

      <InfoDetailDialog
        open={infoDetailDialogOpen}
        onClose={() => {
          setInfoDetailDialogOpen(false);
          setSelectedInfo(null);
        }}
        data={selectedInfo}
        perusahaanOptions={mockPerusahaanOptions}
      />

      <AlertDialog
        open={infoDeleteDialog.open}
        onClose={() => setInfoDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleConfirmDeleteInfo}
        title="Konfirmasi Hapus"
        content={
          <Typography variant="body1">
            Apakah anda yakin akan menghapus <strong>{infoDeleteDialog.name}</strong>?
          </Typography>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </>
  );
}
