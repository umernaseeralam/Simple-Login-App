import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ProductsProvider } from './src/context/ProductsContext';
import AppNavigator from './src/navigation/AppNavigator';

// Wrapper component to use the theme context for StatusBar
const ThemedApp = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <AppNavigator />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <ProductsProvider>
            <ThemedApp />
          </ProductsProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
