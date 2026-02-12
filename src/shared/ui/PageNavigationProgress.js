'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LinearProgress, Box } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function PageNavigationProgress() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const isNavigatingRef = useRef(false);

  // Start progress function
  const startProgress = () => {
    if (isLoading) return; // Already loading
    
    setIsLoading(true);
    setProgress(0);
    isNavigatingRef.current = true;

    // Clear any existing timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Simulate progress with smooth animation
    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      // Increase progress with easing (faster at start, slower near end)
      if (currentProgress < 70) {
        currentProgress += Math.random() * 20 + 10; // Very fast progress
      } else if (currentProgress < 90) {
        currentProgress += Math.random() * 8 + 3; // Slower progress
      } else {
        currentProgress = 90; // Hold at 90% until page loads
      }
      
      setProgress(Math.min(currentProgress, 90));
    }, 50);
  };

  // Detect link clicks to start progress early (before navigation/compiling)
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Skip external links, anchors, and same-page links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('#') && href.length > 1) return;
      
      const currentPath = window.location.pathname;
      if (href === currentPath || href === currentPath + '/') return;

      // Start progress immediately on click (before compiling starts)
      startProgress();
    };

    // Listen for clicks on links (capture phase to catch early)
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isLoading]);

  // Detect pathname change (navigation/compiling completed)
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      // If we're already loading (from click), complete it
      if (isLoading || isNavigatingRef.current) {
        // Complete progress after page loads
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
          isNavigatingRef.current = false;
        }, 200);
      } else {
        // If not loading yet, start it (fallback for programmatic navigation)
        startProgress();
        // Complete after a delay
        loadingTimeoutRef.current = setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
            isNavigatingRef.current = false;
          }, 200);
        }, 300);
      }
      prevPathnameRef.current = pathname;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [pathname, isLoading]);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        height: '4px',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#155DFC',
            transition: 'transform 0.1s linear',
          },
        }}
      />
    </Box>
  );
}
