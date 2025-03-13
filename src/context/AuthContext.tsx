import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  signup: (name: string, identifier: string, password?: string, isPhone?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updatedUser: User) => Promise<boolean>;
  user: User | null;
  isLoading: boolean;
};

type User = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const loadUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (userToken && userData) {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to authenticate the user
      // For this example, we'll simulate a successful login
      
      // Determine if the identifier is an email or phone number
      const isEmail = identifier.includes('@');
      
      // For email login, password is required
      if (isEmail && !password) {
        return false;
      }

      // Create a mock user
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        ...(isEmail ? { email: identifier } : { phoneNumber: identifier }),
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      };

      // Store user data and token
      await AsyncStorage.setItem('userToken', 'mock-token');
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, identifier: string, password?: string, isPhone: boolean = false): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to register the user
      // For this example, we'll simulate a successful registration
      
      // For email signup, password is required
      if (!isPhone && !password) {
        return false;
      }

      // Create a mock user
      const mockUser: User = {
        id: '1',
        name: name,
        ...(isPhone ? { phoneNumber: identifier } : { email: identifier }),
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      };

      // Store user data and token
      await AsyncStorage.setItem('userToken', 'mock-token');
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.log('Signup error:', error);
      return false;
    }
  };

  const updateUserProfile = async (updatedUser: User): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to update the user profile
      // For this example, we'll just update the local storage
      
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.log('Update profile error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear user data and token
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      signup, 
      logout, 
      updateUserProfile,
      user, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 