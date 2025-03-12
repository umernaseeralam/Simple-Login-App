import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Auth: undefined;
  ProfileTab: undefined;
  UserInventory: undefined;
};

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();

  // Get initials from user name
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              // Reset navigation to Main after logout
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                })
              );
            } catch (error) {
              console.log('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="items-center py-8 border-b border-gray-200">
          <View className="w-30 h-30 rounded-full overflow-hidden mb-4 border-3 border-blue-500 bg-blue-500 justify-center items-center">
            <Text className="text-purple-700 text-4xl font-bold">
              {getInitials(user?.name || 'User')}
            </Text>
          </View>
          
          <Text className="text-2xl font-bold mb-1">{user?.name || 'User'}</Text>
          <Text className="text-base text-gray-500 mb-1">{user?.email || 'user@example.com'}</Text>
          <Text className="text-sm text-gray-500">Member since: January 2023</Text>
        </View>
        
        <View className="p-5 mt-4 rounded-lg mx-4 bg-white shadow-sm">
          <Text className="text-lg font-bold mb-2">About Me</Text>
          <Text className="text-emerald-700">
            {user?.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
          </Text>
        </View>
        
        <View className="px-5 py-5 mt-4 mb-8">
          <TouchableOpacity 
            className="py-3 rounded-lg items-center mb-4 bg-blue-500 flex-row justify-center"
            onPress={() => navigation.navigate('EditProfile' as never)}
          >
            <Ionicons name="create-outline" size={20} color="#ffffff" className="mr-2" />
            <Text className="text-white text-base font-bold">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 rounded-lg items-center mb-4 bg-green-500 flex-row justify-center"
            onPress={() => navigation.navigate('UserInventory' as never)}
          >
            <Ionicons name="cube-outline" size={20} color="#ffffff" className="mr-2" />
            <Text className="text-white text-base font-bold">My Inventory</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 rounded-lg items-center border border-red-500 bg-white flex-row justify-center"
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#e74c3c" className="mr-2" />
            <Text className="text-red-500 text-base font-bold">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen; 