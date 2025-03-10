import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types
export type ThemeType = 'light' | 'dark' | 'system';

// Define colors for light and dark themes
export const lightTheme = {
  background: '#f8f8f8',
  card: '#ffffff',
  text: '#333333',
  secondaryText: '#666666',
  border: '#e0e0e0',
  primary: '#3498db',
};

export const darkTheme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#333333',
  primary: '#3498db',
};

type ThemeContextType = {
  theme: ThemeType;
  colors: typeof lightTheme;
  toggleTheme: (newTheme: ThemeType) => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [colors, setColors] = useState(lightTheme);

  // Determine if dark mode is active
  const isDarkMode = 
    theme === 'dark' || 
    (theme === 'system' && systemColorScheme === 'dark');

  // Update colors when theme changes
  useEffect(() => {
    setColors(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Toggle between themes
  const toggleTheme = async (newTheme: ThemeType) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 