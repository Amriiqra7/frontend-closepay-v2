export const fnbPalette = {
  primary: '#0d4f63',
  primaryDark: '#0a4354',
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  border: '#edf1f5',
  surface: '#ffffff',
  surfaceAlt: '#f5f7fa',
  placeholderBg: '#f8fafc',
  placeholderBorder: '#cfd8e3',
};

export const fnbTypography = {
  pageTitle: {
    color: fnbPalette.textPrimary,
    fontSize: { xs: '2.05rem', md: '2.45rem' },
    fontWeight: 800,
    lineHeight: 1.08,
  },
  pageDescription: {
    mt: 1.2,
    color: fnbPalette.textSecondary,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  sectionLabel: {
    color: fnbPalette.textMuted,
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: fnbPalette.textPrimary,
    fontSize: '1.15rem',
    fontWeight: 800,
  },
  bodySm: {
    color: fnbPalette.textMuted,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  bodyMd: {
    color: fnbPalette.textSecondary,
    fontSize: '0.98rem',
    lineHeight: 1.6,
  },
};

export const fnbCardSx = {
  borderRadius: 3,
  border: `1px solid ${fnbPalette.border}`,
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.04)',
};
