'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { AddCircle, Trash } from 'iconsax-react';
import { fnbPalette, fnbTypography } from '../common/styles';

const initialOptions = [
  { id: 'opt-1', name: 'Grilled Chicken', sku: 'PRO-012', offset: 18000, active: true },
  { id: 'opt-2', name: 'Wagyu Slices', sku: 'PRO-015', offset: 45000, active: true },
  { id: 'opt-3', name: 'Crispy Tempeh', sku: 'VEG-002', offset: 5000, active: false },
];

const menuLinks = ['Signature Wagyu Bowl', 'Classic Nasi Lemak', 'Hearty Poke Series'];

const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
const noopSubscribe = () => () => { };

function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const reorderOptions = (list, startIndex, endIndex) => {
  const cloned = [...list];
  const [removed] = cloned.splice(startIndex, 1);
  cloned.splice(endIndex, 0, removed);
  return cloned;
};

function OptionRow({
  option,
  onToggle,
  draggableProps = {},
  dragHandleProps = {},
  innerRef = null,
  isDragging = false,
}) {
  return (
    <Paper
      ref={innerRef}
      {...draggableProps}
      style={draggableProps.style}
      elevation={0}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        bgcolor: '#fff',
        ...(isDragging
          ? {
            borderColor: '#bfd6ff',
            boxShadow: '0 10px 28px rgba(21, 93, 252, 0.14)',
          }
          : null),
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '24px minmax(0, 1.4fr) minmax(0, 0.9fr) minmax(0, 1fr) 54px',
          columnGap: 1.5,
          alignItems: 'center',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
        {...dragHandleProps}
      >
        <Box
          sx={{
            width: 22,
            height: 22,
            color: '#9ca3af',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.12)' },
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 4px)', gap: '2px' }}>
            {[0, 1, 2, 3].map((dot) => (
              <Box key={dot} sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#94a3b8' }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: '#111827', fontSize: '0.92rem', fontWeight: 700 }} noWrap>
            {option.name}
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.74rem' }}>Label name</Typography>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: '#374151', fontSize: '0.78rem', fontWeight: 700 }} noWrap>
            {option.sku}
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.72rem', letterSpacing: '0.06em' }}>SKU CODE</Typography>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: '#0f766e', fontSize: '0.92rem', fontWeight: 800 }} noWrap>
            + {formatCurrency(option.offset)}
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.72rem', letterSpacing: '0.06em' }}>PRICE OFFSET</Typography>
        </Box>

        <Switch
          size="small"
          checked={option.active}
          onChange={() => onToggle(option.id)}
          sx={{
            '& .MuiSwitch-thumb': { bgcolor: '#fff' },
            '& .MuiSwitch-switchBase.Mui-checked': { color: fnbPalette.primary },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: fnbPalette.primary, opacity: 1 },
          }}
        />
      </Box>
    </Paper>
  );
}

export default function CreateGroupEditorPage() {
  const [groupName, setGroupName] = useState('Extra Protein (Sides)');
  const [options, setOptions] = useState(initialOptions);
  const isDndReady = useIsClient();

  const totalOffset = useMemo(() => options.reduce((sum, item) => sum + item.offset, 0), [options]);
  const activeCount = useMemo(() => options.filter((item) => item.active).length, [options]);

  const handleToggleOption = (id) => {
    setOptions((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  const handleAddOption = () => {
    const nextIndex = options.length + 1;
    setOptions((prev) => [
      ...prev,
      {
        id: `opt-${nextIndex}`,
        name: `New Option ${nextIndex}`,
        sku: `NEW-${String(nextIndex).padStart(3, '0')}`,
        offset: 0,
        active: true,
      },
    ]);
  };

  const handleDeleteGroup = () => {
    setGroupName('');
    setOptions([]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    setOptions((prev) => reorderOptions(prev, result.source.index, result.destination.index));
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.85fr) 320px' }, gap: 2.5, alignItems: 'start' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          p: { xs: 2, md: 3 },
          bgcolor: '#fcfdff',
          boxShadow: '0 14px 32px rgba(15, 23, 42, 0.04)',
          mb: 2
        }}
      >
        <Box sx={{ border: '1px solid #e6ebf2', borderRadius: 2.2, p: { xs: 1.5, md: 2 }, bgcolor: '#fff' }}>
          <Typography sx={{ ...fnbTypography.sectionLabel, mb: 1 }}>Group Name</Typography>
          <TextField
            fullWidth
            size="small"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Type group name..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '0.72rem', color: '#98a2b3', fontWeight: 600 }}>
                    {groupName.length}/60
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiInputBase-root': { borderRadius: 1.7, bgcolor: '#f9fafb' }, '& input': { fontWeight: 600 } }}
          />
        </Box>

        <Box sx={{ mt: 2, border: '1px solid #e6ebf2', borderRadius: 2.2, p: { xs: 1.5, md: 2 }, bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ ...fnbTypography.sectionLabel }}>List add-ons & toppings</Typography>
          </Box>

          {isDndReady ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="modifier-options-list">
                {(provided) => (
                  <Stack ref={provided.innerRef} {...provided.droppableProps} spacing={1.1}>
                    {options.map((option, index) => (
                      <Draggable key={option.id} draggableId={option.id} index={index}>
                        {(dragProvided, snapshot) => (
                          <OptionRow
                            option={option}
                            onToggle={handleToggleOption}
                            innerRef={dragProvided.innerRef}
                            draggableProps={dragProvided.draggableProps}
                            dragHandleProps={dragProvided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Stack spacing={1.1}>
              {options.map((option) => (
                <OptionRow key={option.id} option={option} onToggle={handleToggleOption} />
              ))}
            </Stack>
          )}

          <Button
            type="button"
            variant="outlined"
            startIcon={<AddCircle size={16} color={fnbPalette.primary} variant="Bold" />}
            onClick={handleAddOption}
            sx={{
              width: '100%',
              mt: 1.5,
              height: 44,
              borderStyle: 'dashed',
              borderWidth: 1.5,
              borderColor: '#cbd5e1',
              color: fnbPalette.primary,
              borderRadius: 1.8,
              fontWeight: 700,
              '&:hover': { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#94a3b8', bgcolor: '#f8fafc' },
            }}
          >
            Add New Option
          </Button>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25 }}>
          <Button
            component={Link}
            href="/fnb/master-product/add-ons-toppings"
            variant="text"
            sx={{ minWidth: 92, color: '#6b7280', fontWeight: 700, '&:hover': { bgcolor: '#f3f4f6' } }}
          >
            Cancel
          </Button>
          <Button
            component={Link}
            href="/fnb/master-product/add-ons-toppings"
            variant="contained"
            sx={{
              minWidth: 170,
              bgcolor: '#0f5b73',
              borderRadius: 1.8,
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0c4f63' },
            }}
          >
            Save Group Changes
          </Button>
        </Box>
      </Paper>

      <Stack spacing={2}>
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', p: 2.25, bgcolor: '#fff' }}>
          <Typography sx={{ ...fnbTypography.sectionTitle, fontSize: '0.94rem' }}>Group Summary</Typography>
          <Stack spacing={1.25} sx={{ mt: 1.8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>Total Options</Typography>
              <Typography sx={{ color: '#111827', fontSize: '0.86rem', fontWeight: 800 }}>{options.length} Items</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>Active Status</Typography>
              <Typography sx={{ color: '#0f766e', fontSize: '0.76rem', fontWeight: 800 }}>
                {activeCount > 0 ? 'PUBLISHED' : 'DRAFT'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>Avg. Offset</Typography>
              <Typography sx={{ color: '#111827', fontSize: '0.86rem', fontWeight: 800 }}>
                {options.length ? formatCurrency(Math.round(totalOffset / options.length)) : 'Rp 0'}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
