'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminMenuContext = createContext(undefined);

const STORAGE_KEY_MENU = 'admin_selected_menu';
const STORAGE_KEY_COMPANY = 'admin_selected_company';

export function AdminMenuProvider({ children }) {
  // Initialize state as null (will be loaded from localStorage after mount)
  const [selectedMenu, setSelectedMenuState] = useState(null);
  const [selectedCompany, setSelectedCompanyState] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    // Double check for window to avoid SSR issues
    if (typeof window === 'undefined') return;
    
    try {
      const storedMenu = localStorage.getItem(STORAGE_KEY_MENU);
      const storedCompany = localStorage.getItem(STORAGE_KEY_COMPANY);
      
      if (storedMenu) {
        setSelectedMenuState(storedMenu);
      }
      
      if (storedCompany) {
        try {
          setSelectedCompanyState(JSON.parse(storedCompany));
        } catch (e) {
          console.error('Error parsing stored company:', e);
        }
      }
      
      setIsHydrated(true);
    } catch (error) {
      // Silently fail if localStorage is not available
      console.error('Error accessing localStorage:', error);
      setIsHydrated(true);
    }
  }, []);

  // Sync state to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    try {
      if (selectedMenu) {
        localStorage.setItem(STORAGE_KEY_MENU, selectedMenu);
      } else {
        localStorage.removeItem(STORAGE_KEY_MENU);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [selectedMenu, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    try {
      if (selectedCompany) {
        localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(selectedCompany));
      } else {
        localStorage.removeItem(STORAGE_KEY_COMPANY);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [selectedCompany, isHydrated]);

  const setAdminMenu = (menu, company) => {
    setSelectedMenuState(menu);
    setSelectedCompanyState(company);
  };

  const clearAdminMenu = () => {
    setSelectedMenuState(null);
    setSelectedCompanyState(null);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_MENU);
        localStorage.removeItem(STORAGE_KEY_COMPANY);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };

  return (
    <AdminMenuContext.Provider
      value={{
        selectedMenu,
        selectedCompany,
        setAdminMenu,
        clearAdminMenu,
      }}
    >
      {children}
    </AdminMenuContext.Provider>
  );
}

export function useAdminMenu() {
  const context = useContext(AdminMenuContext);
  if (context === undefined) {
    throw new Error('useAdminMenu must be used within an AdminMenuProvider');
  }
  return context;
}
