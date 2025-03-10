import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  SignUp: undefined;
  EditProfile: undefined;
  Auth: undefined;
};

type HeaderProps = {
  showProfileButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({ showProfileButton = true }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, user } = useAuth();

  // Get initials from user name for the profile button
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <View style={[
      styles.header, 
      { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : insets.top }
    ]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MyApp</Text>
      </View>
      
      {showProfileButton && (
        isLoggedIn ? (
          <TouchableOpacity 
            style={styles.profileContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileText}>
              {getInitials(user?.name || 'User')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Ionicons name="log-in-outline" size={16} color="#ffffff" style={styles.loginIcon} />
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db',
  },
  profileContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loginIcon: {
    marginRight: 2,
  },
});

export default Header; 