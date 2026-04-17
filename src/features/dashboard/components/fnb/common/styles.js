export const fnbPalette = {
  primary: '#155DFC',
  primaryDark: '#0d4fc7',
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  border: '#edf1f5',
  surface: '#ffffff',
  surfaceAlt: '#f5f7fa',
  placeholderBg: '#f8fafc',
  placeholderBorder: '#cfd8e3',
};

export const fnbTypeScale = {
  display: { xs: '1.7rem', md: '2rem' },
  sectionTitle: '1.05rem',
  body: '0.9rem',
  caption: '0.76rem',
  control: '0.82rem',
  table: '0.8rem',
};

export const fnbTypography = {
  pageTitle: {
    color: fnbPalette.textPrimary,
    fontSize: fnbTypeScale.display,
    fontWeight: 800,
    lineHeight: 1.12,
  },
  pageDescription: {
    mt: 1.2,
    color: fnbPalette.textSecondary,
    fontSize: fnbTypeScale.body,
    lineHeight: 1.6,
  },
  sectionLabel: {
    color: fnbPalette.textMuted,
    fontSize: fnbTypeScale.caption,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: fnbPalette.textPrimary,
    fontSize: fnbTypeScale.sectionTitle,
    fontWeight: 800,
  },
  bodySm: {
    color: fnbPalette.textMuted,
    fontSize: fnbTypeScale.control,
    fontWeight: 500,
  },
  bodyMd: {
    color: fnbPalette.textSecondary,
    fontSize: fnbTypeScale.body,
    lineHeight: 1.65,
  },
};

export const fnbCardSx = {
  borderRadius: 3,
  border: `1px solid ${fnbPalette.border}`,
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.04)',
};
