export const adminFieldSx = {
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

export const adminLabelSx = {
  mb: 0.5,
  fontSize: '0.875rem',
  color: '#111827',
};

export const pageContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const topSectionSx = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 2,
  flexWrap: 'wrap',
};

export const statGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(210px, 1fr))' },
  gap: 2,
};

export const contentGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', xl: '320px minmax(0, 1fr)' },
  gap: 3,
  alignItems: 'start',
  mb: 2,
};
