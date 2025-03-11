import React from 'react';
import { View, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  SignUp: undefined;
  EditProfile: undefined;
  Auth: undefined;
  Settings: undefined;
};

type HeaderProps = {
  showProfileButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({ showProfileButton = true }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  // Get initials from user name for the profile button
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <View 
      className="flex-row justify-between items-center px-4 pb-2.5 border-b"
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : insets.top,
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }}
    >
      <View className="flex-row items-center">
        <Text className="text-2xl font-bold" style={{ color: colors.primary }}>MyApp</Text>
      </View>
      
      <View className="flex-row items-center">
        {/* Theme toggle button */}
        <TouchableOpacity 
          className="h-10 w-10 rounded-full justify-center items-center mr-2.5"
          style={{ backgroundColor: colors.primary + '20' }}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons 
            name={isDarkMode ? "sunny-outline" : "moon-outline"} 
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        
        {showProfileButton && (
          isLoggedIn ? (
            <TouchableOpacity 
              className="h-10 w-10 rounded-full overflow-hidden border justify-center items-center"
              style={{ 
                borderColor: '#e0e0e0',
                backgroundColor: '#3498db'
              }}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text className="text-white text-base font-bold">
                {getInitials(user?.name || 'User')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="py-2 px-4 rounded-full bg-[#3498db] flex-row items-center"
              onPress={() => navigation.navigate('Auth')}
            >
              <Ionicons name="log-in-outline" size={16} color="#ffffff" className="mr-0.5" />
              <Text className="text-white text-sm font-bold ml-1.5">Sign In</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default Header; 