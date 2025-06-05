import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeMode, ThemeConfig } from '../types';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  themeConfig: ThemeConfig;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  isDark: boolean;
  language: 'en' | 'de';
  setLanguage: (lang: 'en' | 'de') => void;
}

const defaultThemeConfig: ThemeConfig = {
  primaryColor: '#3B82F6',
  roundedCorners: true,
  logoUrl: '/logo.svg'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<'en' | 'de'>('de');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    const savedConfig = localStorage.getItem('themeConfig');
    const savedLanguage = localStorage.getItem('language') as 'en' | 'de';
    
    if (savedMode) {
      setModeState(savedMode);
    }
    
    if (savedConfig) {
      setThemeConfig(JSON.parse(savedConfig));
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const darkMode = mode === 'dark';
    setIsDark(darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const updateThemeConfig = (config: Partial<ThemeConfig>) => {
    const newConfig = { ...themeConfig, ...config };
    setThemeConfig(newConfig);
    localStorage.setItem('themeConfig', JSON.stringify(newConfig));
    document.documentElement.style.setProperty('--color-primary', newConfig.primaryColor);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', themeConfig.primaryColor);
  }, [themeConfig]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      setMode, 
      themeConfig, 
      updateThemeConfig,
      isDark,
      language,
      setLanguage
    }}>
      {children}
    </ThemeContext.Provider>
  );
};