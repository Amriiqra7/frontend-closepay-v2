'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add, DocumentUpload, Gallery, Trash } from 'iconsax-react';
import { PiForkKnifeFill } from 'react-icons/pi';
import ProductList from './ProductList';
import { addOnGroups, ingredients, statCards } from './data';
import { SectionTitle, StatCard, SummaryMetric } from './parts';

const adminFieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.875rem',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
  },
};

const adminLabelSx = {
  mb: 0.5,
  fontSize: '0.875rem',
  color: '#111827',
};

export default function FnbMenuVariationsPage() {
  const [selectedProduct, setSelectedProduct] = React.useState(1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ color: '#103b55', fontSize: { xs: '2rem', md: '2.25rem' }, fontWeight: 800, lineHeight: 1.1 }}>
            Master Menu
          </Typography>
          <Typography sx={{ mt: 0.75, color: '#6b7280', fontSize: '0.95rem' }}>
            Manage culinary products, pricing strategies, and inventory recipes.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<DocumentUpload size={18} color="#0f172a" variant="Linear" />}
            sx={{ minWidth: 120, height: 44, borderRadius: 2, borderColor: '#dbe3ec', color: '#0f172a', bgcolor: '#fff' }}
          >
            Bulk Import
          </Button>
          <Button
            variant="contained"
            startIcon={<Add size={18} color="#fff" variant="Linear" />}
            sx={{
              minWidth: 144,
              height: 44,
              borderRadius: 2,
              bgcolor: '#0d4f63',
              boxShadow: '0 10px 24px rgba(13, 79, 99, 0.24)',
              '&:hover': { bgcolor: '#0a4354' },
            }}
          >
            Add New Menu
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(210px, 1fr))' },
          gap: 2,
        }}
      >
        {statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '320px minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'start',
          mb: 2,
        }}
      >
        <ProductList selectedProduct={selectedProduct} onSelect={setSelectedProduct} />

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', overflow: 'hidden', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.05)' }}>
          <Box sx={{ p: { xs: 2.25, md: 2.5 }, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: '#e5f0f5', color: '#0d4f63' }}>
                <PiForkKnifeFill size={30} />
              </Avatar>
              <Box>
                <Typography sx={{ color: '#111827', fontSize: { xs: '1.45rem', md: '1.95rem' }, fontWeight: 800, lineHeight: 1.08 }}>
                  Artisan Green Salad
                </Typography>
                <Typography sx={{ mt: 0.55, color: '#6b7280', fontSize: '0.88rem' }}>
                  Product ID: SKU-CUL-00812
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button variant="text" sx={{ minWidth: 40, width: 40, height: 40, p: 0, color: '#6b7280' }}>
                <Trash size={18} color="#6b7280" variant="Linear" />
              </Button>
              <Button variant="contained" sx={{ minWidth: 132, height: 46, borderRadius: 2, bgcolor: '#0d4f63', '&:hover': { bgcolor: '#0a4354' } }}>
                Save
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
            <SectionTitle title="General Information" />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '220px minmax(0, 1fr)' }, gap: 3 }}>
              <Box>
                <Box
                  sx={{
                    height: 210,
                    borderRadius: 2.5,
                    border: '1px dashed #cfd8e3',
                    bgcolor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: '#e8f1f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Gallery size={30} color="#0d4f63" variant="Bold" />
                  </Box>
                  <Typography sx={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600 }}>
                    No preview image
                  </Typography>
                </Box>
                <Typography sx={{ mt: 1, color: '#9aa5b1', fontSize: '0.7rem', textAlign: 'center', fontStyle: 'italic' }}>
                  Optimized for Web: 800x800px, WEBP format recommended.
                </Typography>
              </Box>

              <Stack spacing={2.25}>
                <Box>
                  <Typography variant="body2" sx={adminLabelSx}>
                    Menu Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value="Artisan Green Salad"
                    placeholder="Menu Name"
                    InputProps={{ sx: { fontSize: '0.875rem' } }}
                    inputProps={{ style: { fontSize: '0.875rem' } }}
                    FormHelperTextProps={{ sx: { fontSize: '0.75rem' } }}
                    sx={adminFieldSx}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={adminLabelSx}>
                      Category
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value="Starters"
                      InputProps={{ sx: { fontSize: '0.875rem' } }}
                      inputProps={{ style: { fontSize: '0.875rem' } }}
                      sx={adminFieldSx}
                    >
                      <MenuItem value="Starters" sx={{ fontSize: '0.875rem' }}>
                        Starters
                      </MenuItem>
                      <MenuItem value="Main Course" sx={{ fontSize: '0.875rem' }}>
                        Main Course
                      </MenuItem>
                    </TextField>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={adminLabelSx}>
                      Status
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 1.5,
                        py: 0.7,
                        minHeight: 40,
                        borderRadius: 1,
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography sx={{ color: '#111827', fontSize: '0.875rem', fontWeight: 400 }}>
                        Active
                      </Typography>
                      <Switch defaultChecked size="small" />
                    </Paper>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={adminLabelSx}>
                    Description
                  </Typography>
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    size="small"
                    defaultValue="Organic baby kale, heritage tomatoes, toasted pine nuts, and a balsamic truffle glaze. Served chilled with a side of house-made sourdough crisps."
                    placeholder="Description"
                    InputProps={{ sx: { fontSize: '0.875rem' } }}
                    inputProps={{ style: { fontSize: '0.875rem' } }}
                    FormHelperTextProps={{ sx: { fontSize: '0.75rem' } }}
                    sx={adminFieldSx}
                  />
                </Box>
              </Stack>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
            <SectionTitle
              title="Recipe & Bill Of Materials (BOM)"
              action={
                <Button variant="outlined" startIcon={<Add size={16} color="#0d4f63" variant="Linear" />} sx={{ borderColor: '#dbe3ec', color: '#0d4f63', borderRadius: 2 }}>
                  Add Ingredient
                </Button>
              }
            />

            <TableContainer sx={{ border: '1px solid #edf1f5', borderRadius: 2.5, overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#fafbfd' }}>
                  <TableRow>
                    {['Ingredient', 'Ingredient ID', 'Quantity', 'Unit', 'Line Item'].map((head) => (
                      <TableCell key={head} sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#7b8794', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell sx={{ fontWeight: 600, minWidth: 170 }}>{ingredient.name}</TableCell>
                      <TableCell sx={{ color: '#6b7280' }}>{ingredient.id}</TableCell>
                      <TableCell>{ingredient.qty}</TableCell>
                      <TableCell>{ingredient.unit}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{ingredient.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
              <SummaryMetric label="Total Recipe HPP" value="$ 3.15" />
              <SummaryMetric label="Markup (%)" value="300" />
              <SummaryMetric label="Base Sale Price" value="$ 12.50" accent />
            </Box>

            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <SummaryMetric label="Profit per Unit" value="$9.35" subtle="Strong positive margin" />
              <SummaryMetric label="Gross Margin" value="74.8%" subtle="Healthy menu profitability" dark />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
            <SectionTitle
              title="Add-Ons & Toppings Management"
              action={<Typography sx={{ color: '#0d4f63', fontSize: '0.8rem', fontWeight: 700 }}>Manage All Groups</Typography>}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {addOnGroups.map((group) => (
                <Paper key={group.title} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e8edf3', bgcolor: '#fafbfd' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
                    <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{group.title}</Typography>
                    <Chip label={group.badge} size="small" sx={{ bgcolor: '#eef4f7', color: '#4a6672', fontWeight: 700, fontSize: '0.65rem' }} />
                  </Box>

                  <Stack spacing={1}>
                    {group.items.map((item) => (
                      <Paper key={item.name} elevation={0} sx={{ p: 1.25, borderRadius: 2, bgcolor: '#fff', border: '1px solid #eef2f6', minHeight: 72, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                          <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</Typography>
                          <Typography sx={{ color: '#0d4f63', fontWeight: 700, flexShrink: 0 }}>{item.price}</Typography>
                        </Box>
                      </Paper>
                    ))}
                    <Button variant="outlined" sx={{ borderStyle: 'dashed', borderColor: '#d3dde5', color: '#6b7280', borderRadius: 2 }}>
                      + Add Option
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
