'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tooltip,
  TextField,
  Typography,
} from '@mui/material';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { AddCircle, Trash } from 'iconsax-react';
import { fnbMenuAddonGroup, fnbMenuAddonItem } from '@/core/services/api_fnb';
import { getApiErrorMessage, showErrorToast, toastPromise } from '@/shared/utils/toast';
import { formatRupiah, parseRupiah } from '@/shared/utils/format';

const parseNumber = (value) => {
  const parsed = Number(parseRupiah(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const createItemRow = (overrides = {}) => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  _id: '',
  name: '',
  price: '',
  isAvailable: true,
  isDefault: false,
  ...overrides,
});

const textareaSx = {
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  color: '#111827',
  padding: '10px 14px',
  lineHeight: 1.5,
  resize: 'vertical',
  backgroundColor: '#fff',
  outline: 'none',
};

const labelSx = {
  color: '#374151',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  letterSpacing: 'normal',
};

const CustomTooltip = ({ title, children }) => (
  <Tooltip
    title={title}
    arrow
    disableInteractive
    componentsProps={{
      tooltip: {
        sx: {
          bgcolor: '#111827',
          fontSize: '0.75rem',
          px: 1,
          py: 0.5,
        },
      },
      arrow: {
        sx: {
          color: '#111827',
        },
      },
    }}
  >
    <Box component="span">{children}</Box>
  </Tooltip>
);

const AddonItemRow = React.memo(function AddonItemRow({
  item,
  itemKey,
  index,
  canRemove,
  isSaving,
  onRemoveItem,
  onSaveItem,
  onChangeItem,
}) {
  const handleRemove = React.useCallback(() => onRemoveItem(itemKey), [onRemoveItem, itemKey]);
  const handleSave = React.useCallback(() => onSaveItem(itemKey), [onSaveItem, itemKey]);
  const handleChangeName = React.useCallback((e) => onChangeItem(itemKey, 'name', e.target.value), [onChangeItem, itemKey]);
  const handleChangePrice = React.useCallback((e) => onChangeItem(itemKey, 'price', parseRupiah(e.target.value)), [onChangeItem, itemKey]);
  const handleToggleAvailable = React.useCallback((e) => onChangeItem(itemKey, 'isAvailable', e.target.checked), [onChangeItem, itemKey]);
  const handleToggleDefault = React.useCallback((e) => onChangeItem(itemKey, 'isDefault', e.target.checked), [onChangeItem, itemKey]);

  return (
    <Box
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        p: 1.5,
        bgcolor: '#fafbfd',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
        <Typography sx={{ color: '#111827', fontWeight: 500 }}>Item {index + 1}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {item._id ? (
            <CustomTooltip title="Save">
              <IconButton size="small" onClick={handleSave} disabled={isSaving} sx={{ color: '#155DFC' }}>
                <SaveOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </CustomTooltip>
          ) : null}
          {canRemove ? (
            <CustomTooltip title="Hapus">
              <IconButton size="small" onClick={handleRemove} sx={{ color: '#d32f2f' }}>
                <Trash size={18} color="#d32f2f" variant="Linear" />
              </IconButton>
            </CustomTooltip>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
        <Box>
          <Typography sx={{ ...labelSx, mb: 0.75 }}>Name</Typography>
          <TextField fullWidth size="small" value={item.name} onChange={handleChangeName} placeholder="Nama item" />
        </Box>
        <Box>
          <Typography sx={{ ...labelSx, mb: 0.75 }}>Price</Typography>
          <TextField
            fullWidth
            size="small"
            value={formatRupiah(item.price || '')}
            onChange={handleChangePrice}
            placeholder="0"
            inputProps={{ inputMode: 'numeric' }}
          />
        </Box>
        <Box>
          <Typography sx={{ ...labelSx, mb: 0.75 }}>Is Available</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 2, px: 1.25, py: 0.5 }}>
            <Typography sx={{ color: item.isAvailable ? '#155DFC' : '#6b7280', fontWeight: 500, fontSize: '0.82rem' }}>
              {item.isAvailable ? 'Aktif' : 'Nonaktif'}
            </Typography>
            <Switch checked={item.isAvailable} onChange={handleToggleAvailable} size="small" />
          </Box>
        </Box>
        <Box>
          <Typography sx={{ ...labelSx, mb: 0.75 }}>Is Default</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 2, px: 1.25, py: 0.5 }}>
            <Typography sx={{ color: item.isDefault ? '#155DFC' : '#6b7280', fontWeight: 500, fontSize: '0.82rem' }}>
              {item.isDefault ? 'Yes' : 'No'}
            </Typography>
            <Switch checked={item.isDefault} onChange={handleToggleDefault} size="small" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default function EditGroupEditorPage({ addonGroupId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [itemSavingMap, setItemSavingMap] = React.useState({});

  const [groupName, setGroupName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectionType, setSelectionType] = React.useState('SINGLE');
  const [minSelection, setMinSelection] = React.useState('0');
  const [maxSelection, setMaxSelection] = React.useState('0');
  const [isRequired, setIsRequired] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [items, setItems] = React.useState([createItemRow()]);

  const isMultiple = selectionType === 'MULTIPLE';

  const { data: groupResponse, error: groupError, mutate: mutateGroup } = useSWR(
    addonGroupId ? ['fnb-addon-group-edit', addonGroupId] : null,
    () => fnbMenuAddonGroup.getById(addonGroupId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const { data: itemListResponse, error: itemListError, mutate: mutateItems } = useSWR(
    addonGroupId ? ['fnb-addon-item-edit', addonGroupId] : null,
    () => fnbMenuAddonItem.find({ groupId: addonGroupId, size: 100, page: 1, order: 'asc' }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    const groupData = groupResponse?.data?.data || groupResponse?.data || {};
    setGroupName(groupData?.name || '');
    setDescription(groupData?.description || '');
    setSelectionType(groupData?.selectionType || 'SINGLE');
    setMinSelection(String(groupData?.minSelection ?? 0));
    setMaxSelection(String(groupData?.maxSelection ?? 0));
    setIsRequired(Boolean(groupData?.isRequired));
    setIsActive(Boolean(groupData?.isActive));
  }, [groupResponse]);

  React.useEffect(() => {
    const rawItems = itemListResponse?.data?.data?.items || itemListResponse?.data?.items || [];
    const mappedItems = (Array.isArray(rawItems) ? rawItems : []).map((item, index) =>
      createItemRow({
        key: item?._id || `item-${index}-${Date.now()}`,
        _id: item?._id || '',
        name: item?.name || '',
        price: String(item?.price ?? ''),
        isAvailable: Boolean(item?.isAvailable),
        isDefault: Boolean(item?.isDefault),
      })
    );
    setItems(mappedItems.length > 0 ? mappedItems : [createItemRow()]);
  }, [itemListResponse]);

  React.useEffect(() => {
    if (groupError) {
      showErrorToast(getApiErrorMessage(groupError, 'Gagal memuat detail grup add-on.'));
    }
  }, [groupError]);

  React.useEffect(() => {
    if (itemListError) {
      showErrorToast(getApiErrorMessage(itemListError, 'Gagal memuat list item add-on.'));
    }
  }, [itemListError]);

  const handleAddItem = React.useCallback(() => {
    setItems((prev) => [...prev, createItemRow()]);
  }, []);

  const handleRemoveItem = React.useCallback((key) => {
    const target = items.find((item) => item.key === key);
    if (!target) return;

    const executeRemove = async () => {
      if (target._id) {
        await fnbMenuAddonItem.delete(target._id);
      }
      setItems((prev) => prev.filter((item) => item.key !== key));
    };

    toastPromise(executeRemove(), {
      loading: `Menghapus item "${target.name || 'Item'}"...`,
      success: `Item "${target.name || 'Item'}" berhasil dihapus.`,
      error: (error) => getApiErrorMessage(error, 'Gagal menghapus item.'),
    });
  }, [items]);

  const handleChangeItem = React.useCallback((key, field, value) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  }, []);

  const handleSaveItem = React.useCallback(
    async (key) => {
      const target = items.find((item) => item.key === key);
      if (!target?._id || !target?.name?.trim()) return;

      const payload = {
        name: target.name.trim(),
        price: parseNumber(target.price),
        isAvailable: Boolean(target.isAvailable),
        isDefault: Boolean(target.isDefault),
      };

      setItemSavingMap((prev) => ({ ...prev, [key]: true }));
      try {
        await toastPromise(fnbMenuAddonItem.update(target._id, payload), {
          loading: `Menyimpan item "${target.name}"...`,
          success: `Item "${target.name}" berhasil diperbarui.`,
          error: (error) => getApiErrorMessage(error, 'Gagal menyimpan item.'),
        });
        await mutateItems();
      } finally {
        setItemSavingMap((prev) => ({ ...prev, [key]: false }));
      }
    },
    [items, mutateItems]
  );

  const handleSubmit = async () => {
    if (!groupName.trim()) return;
    if (isMultiple && (minSelection === '' || maxSelection === '')) return;

    const groupPayload = {
      name: groupName.trim(),
      description: description.trim(),
      selectionType,
      isRequired,
      isActive,
      ...(isMultiple
        ? {
            minSelection: parseNumber(minSelection),
            maxSelection: parseNumber(maxSelection),
          }
        : {}),
    };

    const newItems = items.filter((item) => !item._id && item.name.trim());

    setIsSubmitting(true);
    try {
      const submitPromise = (async () => {
        await fnbMenuAddonGroup.update(addonGroupId, groupPayload);
        if (newItems.length > 0) {
          await fnbMenuAddonItem.bulkCreate(
            newItems.map((item) => ({
              groupId: addonGroupId,
              name: item.name.trim(),
              price: parseNumber(item.price),
              isAvailable: Boolean(item.isAvailable),
              isDefault: Boolean(item.isDefault),
            }))
          );
        }
      })();

      await toastPromise(submitPromise, {
        loading: 'Menyimpan grup add-on...',
        success: 'Grup add-on berhasil diperbarui.',
        error: (error) => getApiErrorMessage(error, 'Gagal menyimpan grup add-on.'),
      });
      await mutateGroup();
      await mutateItems();
      router.push('/fnb/master-product/add-ons-toppings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5, alignItems: 'start' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          p: { xs: 2, md: 3 },
          bgcolor: '#fcfdff',
          boxShadow: '0 14px 32px rgba(15, 23, 42, 0.04)',
          mb: 2,
        }}
      >
        <Box sx={{ border: '1px solid #e6ebf2', borderRadius: 2.2, p: { xs: 1.5, md: 2 }, bgcolor: '#fff' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography sx={{ ...labelSx, mb: 1 }}>Group Name <Box component="span" sx={{ color: '#dc2626' }}>*</Box></Typography>
              <TextField fullWidth required size="small" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Type group name..." />
            </Box>
            <Box>
              <Typography sx={{ ...labelSx, mb: 1 }}>Selection Type <Box component="span" sx={{ color: '#dc2626' }}>*</Box></Typography>
              <TextField select required fullWidth size="small" value={selectionType} onChange={(e) => setSelectionType(e.target.value)}>
                <MenuItem value="SINGLE">SINGLE</MenuItem>
                <MenuItem value="MULTIPLE">MULTIPLE</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Typography sx={{ ...labelSx, mb: 1 }}>Description</Typography>
          <TextareaAutosize minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." style={textareaSx} />

          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
            <Box>
              <Typography sx={{ ...labelSx, mb: 0.75 }}>Status Group</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 2, px: 1.25, py: 0.5 }}>
                <Typography sx={{ color: isActive ? '#155DFC' : '#6b7280', fontWeight: 500, fontSize: '0.82rem' }}>
                  {isActive ? 'Aktif' : 'Nonaktif'}
                </Typography>
                <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} size="small" />
              </Box>
            </Box>
            <Box>
              <Typography sx={{ ...labelSx, mb: 0.75 }}>Required</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 2, px: 1.25, py: 0.5 }}>
                <Typography sx={{ color: isRequired ? '#155DFC' : '#6b7280', fontWeight: 500, fontSize: '0.82rem' }}>
                  {isRequired ? 'Yes' : 'No'}
                </Typography>
                <Switch checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} size="small" />
              </Box>
            </Box>
            <Box>
              <Typography sx={{ ...labelSx, mb: 0.75 }}>Min Selection</Typography>
              <TextField fullWidth size="small" type="number" value={minSelection} onChange={(e) => setMinSelection(e.target.value)} disabled={!isMultiple} />
            </Box>
            <Box>
              <Typography sx={{ ...labelSx, mb: 0.75 }}>Max Selection</Typography>
              <TextField fullWidth size="small" type="number" value={maxSelection} onChange={(e) => setMaxSelection(e.target.value)} disabled={!isMultiple} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, border: '1px solid #e6ebf2', borderRadius: 2.2, p: { xs: 1.5, md: 2 }, bgcolor: '#fff' }}>
          <Typography sx={{ ...labelSx, mb: 1 }}>List add-ons & toppings</Typography>

          <Stack spacing={1.5}>
            {items.map((item, index) => (
              <AddonItemRow
                key={item.key}
                item={item}
                itemKey={item.key}
                index={index}
                canRemove={items.length > 1}
                isSaving={Boolean(itemSavingMap[item.key])}
                onRemoveItem={handleRemoveItem}
                onSaveItem={handleSaveItem}
                onChangeItem={handleChangeItem}
              />
            ))}
          </Stack>
          <Box sx={{ mt: 1.5 }}>
            <Button variant="outlined" startIcon={<AddCircle size={16} color="#155DFC" variant="Bold" />} onClick={handleAddItem} sx={{ textTransform: 'none' }}>
              Add Item
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={1.25}>
          <Button component={Link} href="/fnb/master-product/add-ons-toppings" variant="text" sx={{ color: '#6b7280', fontWeight: 500, '&:hover': { bgcolor: '#f3f4f6' } }}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting || !groupName.trim() || (isMultiple && (minSelection === '' || maxSelection === ''))}
            sx={{
              bgcolor: '#155DFC',
              borderRadius: 1.8,
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0f4fd8' },
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
