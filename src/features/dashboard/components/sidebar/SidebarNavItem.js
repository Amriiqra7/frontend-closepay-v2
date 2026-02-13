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
  Tooltip,
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

  // Recursively check if any child or grandchild is active
  const checkChildrenActive = (children) => {
    if (!children) return false;
    return children.some((child) => {
      if (isPathActive(pathname, child.href)) return true;
      if (child.children) return checkChildrenActive(child.children);
      return false;
    });
  };

  const active =
    isPathActive(pathname, item.href) ||
    (hasChildren && checkChildrenActive(item.children));

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

  const buttonContent = (
    <ListItemButton
      ref={anchorRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        borderRadius: 2,
        bgcolor: active ? 'rgba(21, 93, 252, 0.1)' : 'transparent',
        color: active ? brandColor : '#262626',
        '&:hover': {
          bgcolor: active ? 'rgba(21, 93, 252, 0.15)' : '#f5f5f5',
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
          color={active ? brandColor : '#262626'}
          variant={active ? 'Bold' : 'Linear'}
        />
      </ListItemIcon>

      {desktopExpanded && (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: active ? 400 : 400,
            color: active ? brandColor : 'inherit',
          }}
        />
      )}

      {desktopExpanded && hasChildren && (
        <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
          <ArrowDown2
            size={18}
            color={active ? brandColor : '#262626'}
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease',
            }}
          />
        </Box>
      )}
    </ListItemButton>
  );

  return (
    <Box>
      {!desktopExpanded && !hasChildren ? (
        <Tooltip title={item.label} placement="right" arrow>
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}

      {desktopExpanded && hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: 2, pt: 0.5, pb: 0.75 }}>
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              const childHasChildren = Array.isArray(child.children) && child.children.length > 0;
              const childActive = isPathActive(pathname, child.href) || 
                (childHasChildren && checkChildrenActive(child.children));
              const [childOpen, setChildOpen] = React.useState(childActive);

              React.useEffect(() => {
                if (childActive && childHasChildren) setChildOpen(true);
              }, [childActive, childHasChildren]);

              return (
                <Box key={child.id}>
                <ListItemButton
                    onClick={() => {
                      if (childHasChildren) {
                        setChildOpen((v) => !v);
                      } else {
                        onNavigate(child.href);
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      ml: 1,
                      mb: 0.25,
                      py: 1,
                      bgcolor: 'transparent',
                      color: childActive ? brandColor : '#262626',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                    <ChildIcon
                      size={22}
                      color={childActive ? brandColor : '#262626'}
                      variant={childActive ? 'Bold' : 'Linear'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={child.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: childActive ? 400 : 400,
                      color: childActive ? brandColor : 'inherit',
                      }}
                    />
                    {childHasChildren && (
                      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                        <ArrowDown2
                          size={16}
                          color={childActive ? brandColor : '#262626'}
                          style={{
                            transform: childOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 150ms ease',
                          }}
                        />
                      </Box>
                    )}
                  </ListItemButton>
                  {childHasChildren && (
                    <Collapse in={childOpen} timeout="auto" unmountOnExit>
                      <List disablePadding sx={{ pl: 3, pt: 0.25, pb: 0.5 }}>
                        {child.children.map((grandChild) => {
                          const GrandChildIcon = grandChild.icon;
                          const grandChildActive = isPathActive(pathname, grandChild.href);

                          return (
                            <ListItemButton
                              key={grandChild.id}
                              onClick={() => onNavigate(grandChild.href)}
                              sx={{
                                borderRadius: 2,
                                ml: 1,
                                mb: 0.25,
                                py: 0.75,
                                bgcolor: 'transparent',
                                color: grandChildActive ? brandColor : '#262626',
                                '&:hover': {
                                  bgcolor: '#f5f5f5',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                                <GrandChildIcon
                                  size={22}
                                  color={grandChildActive ? brandColor : '#262626'}
                                  variant={grandChildActive ? 'Bold' : 'Linear'}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={grandChild.label}
                                primaryTypographyProps={{
                                  fontSize: '0.9rem',
                                  fontWeight: grandChildActive ? 400 : 400,
                                  color: grandChildActive ? brandColor : 'inherit',
                    }}
                  />
                </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </Box>
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
            elevation={0}
            sx={{
              minWidth: 220,
              borderRadius: 2,
              border: '1px solid rgba(8,8,8,0.1)',
              overflow: 'hidden',
              py: 1,
              boxShadow: 'none',
            }}
          >
            <Box
              sx={{
                px: 2,
                pb: 1,
                fontSize: '0.75rem',
                fontWeight: 400,
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
                const childHasChildren = Array.isArray(child.children) && child.children.length > 0;
                const childActive = isPathActive(pathname, child.href) || 
                  (childHasChildren && checkChildrenActive(child.children));

                return (
                  <Box key={child.id}>
                  <ListItemButton
                      onClick={() => {
                        if (!childHasChildren) {
                          onNavigate(child.href);
                        }
                      }}
                    sx={{
                      borderRadius: 2,
                      mb: 0.25,
                      py: 1,
                      bgcolor: 'transparent',
                      color: childActive ? brandColor : '#262626',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                      <ChildIcon
                        size={22}
                        color={childActive ? brandColor : '#262626'}
                        variant={childActive ? 'Bold' : 'Linear'}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: childActive ? 400 : 400,
                        color: childActive ? brandColor : 'inherit',
                        }}
                      />
                      {childHasChildren && (
                        <ArrowDown2
                          size={14}
                          color={childActive ? brandColor : '#262626'}
                        />
                      )}
                    </ListItemButton>
                    {childHasChildren && (
                      <List disablePadding sx={{ pl: 2 }}>
                        {child.children.map((grandChild) => {
                          const GrandChildIcon = grandChild.icon;
                          const grandChildActive = isPathActive(pathname, grandChild.href);

                          return (
                            <ListItemButton
                              key={grandChild.id}
                              onClick={() => onNavigate(grandChild.href)}
                              sx={{
                                borderRadius: 2,
                                mb: 0.25,
                                py: 0.75,
                                bgcolor: 'transparent',
                                color: grandChildActive ? brandColor : '#262626',
                                '&:hover': {
                                  bgcolor: '#f5f5f5',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                                <GrandChildIcon
                                  size={22}
                                  color={grandChildActive ? brandColor : '#262626'}
                                  variant={grandChildActive ? 'Bold' : 'Linear'}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={grandChild.label}
                                primaryTypographyProps={{
                                  fontSize: '0.9rem',
                                  fontWeight: grandChildActive ? 400 : 400,
                                  color: grandChildActive ? brandColor : 'inherit',
                      }}
                    />
                  </ListItemButton>
                          );
                        })}
                      </List>
                    )}
                  </Box>
                );
              })}
            </List>
          </Paper>
        </Popper>
      )}
    </Box>
  );
}

