'use client';

import React from 'react';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
} from '@mui/material';
import { ArrowDown2 } from 'iconsax-react';

function isPathActive(pathname, href) {
  if (!href) return false;
  if (href === '/') return pathname === '/';
  
  // Simple path matching - routes are now properly structured as /admin/[menu]/[sub-menu]
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SidebarNavItem({
  item,
  pathname,
  onNavigate,
  brandColor,
  desktopExpanded,
}) {
  const Icon = item.icon;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const active =
    isPathActive(pathname, item.href) ||
    (hasChildren && item.children.some((c) => isPathActive(pathname, c.href)));

  const [open, setOpen] = React.useState(active);
  const [hoverOpen, setHoverOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  React.useEffect(() => {
    // keep parent expanded when navigating into its subtree
    if (active && hasChildren) setOpen(true);
  }, [active, hasChildren]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen((v) => !v);
      return;
    }
    onNavigate(item.href);
  };

  const handleMouseEnter = () => {
    if (!desktopExpanded && hasChildren) setHoverOpen(true);
  };

  const handleMouseLeave = () => {
    if (!desktopExpanded && hasChildren) setHoverOpen(false);
  };

  return (
    <Box>
      <ListItemButton
        ref={anchorRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          borderRadius: 2,
          bgcolor: active ? brandColor : 'transparent',
          color: active ? 'white' : brandColor,
          '&:hover': {
            bgcolor: active ? brandColor : '#f5f5f5',
          },
          py: 1.25,
          justifyContent: desktopExpanded ? 'flex-start' : 'center',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: desktopExpanded ? 2 : 0,
            color: 'inherit',
            justifyContent: 'center',
          }}
        >
          <Icon
            size={22}
            color={active ? '#fff' : brandColor}
            variant={active ? 'Bold' : 'Linear'}
          />
        </ListItemIcon>

        {desktopExpanded && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: active ? 600 : 500,
              color: active ? 'white' : 'inherit',
            }}
          />
        )}

        {desktopExpanded && hasChildren && (
          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            <ArrowDown2
              size={18}
              color={active ? '#fff' : brandColor}
              style={{
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            />
          </Box>
        )}
      </ListItemButton>

      {desktopExpanded && hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: 2, pt: 0.5, pb: 0.75 }}>
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              const childActive = isPathActive(pathname, child.href);

              return (
                <ListItemButton
                  key={child.id}
                  onClick={() => onNavigate(child.href)}
                  sx={{
                    borderRadius: 2,
                    ml: 1,
                    mb: 0.25,
                    py: 1,
                    bgcolor: childActive ? brandColor : 'transparent',
                    color: childActive ? 'white' : brandColor,
                    '&:hover': {
                      bgcolor: childActive ? brandColor : '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                    <ChildIcon
                      size={18}
                      color={childActive ? '#fff' : brandColor}
                      variant={childActive ? 'Bold' : 'Linear'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={child.label}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: childActive ? 600 : 500,
                      color: childActive ? 'white' : 'inherit',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}

      {/* Collapsed (icon-only) hover submenu */}
      {!desktopExpanded && hasChildren && (
        <Popper
          open={hoverOpen}
          anchorEl={anchorRef.current}
          placement="right-start"
          disablePortal={false}
          modifiers={[
            { name: 'offset', options: { offset: [8, 0] } },
            { name: 'preventOverflow', options: { padding: 8 } },
          ]}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
          onMouseEnter={() => setHoverOpen(true)}
          onMouseLeave={() => setHoverOpen(false)}
        >
          <Paper
            elevation={6}
            sx={{
              minWidth: 220,
              borderRadius: 2,
              border: '1px solid rgba(8,8,8,0.08)',
              overflow: 'hidden',
              py: 1,
            }}
          >
            <Box
              sx={{
                px: 2,
                pb: 1,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'rgba(8,8,8,0.6)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </Box>
            <List disablePadding sx={{ px: 1 }}>
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const childActive = isPathActive(pathname, child.href);

                return (
                  <ListItemButton
                    key={child.id}
                    onClick={() => onNavigate(child.href)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.25,
                      py: 1,
                      bgcolor: childActive ? brandColor : 'transparent',
                      color: childActive ? 'white' : brandColor,
                      '&:hover': {
                        bgcolor: childActive ? brandColor : '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                      <ChildIcon
                        size={18}
                        color={childActive ? '#fff' : brandColor}
                        variant={childActive ? 'Bold' : 'Linear'}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: childActive ? 600 : 500,
                        color: childActive ? 'white' : 'inherit',
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        </Popper>
      )}
    </Box>
  );
}

