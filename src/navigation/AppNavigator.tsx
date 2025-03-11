import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Import React Native Vector Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import ExampleScreen from '../screens/ExampleScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';

// Define the item type for chat
type Item = {
  id: number;
  title: string;
  description: string;
  color: string;
  price: string;
};

// Define the param list for the stack navigator
export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  SignUp: undefined;
  EditProfile: undefined;
  Auth: undefined;
  ProfileTab: undefined;
  Settings: undefined;
  Chat: { item: Item };
  Example: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator - contains Login and SignUp screens
const AuthNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

// Home Tab Navigator
const HomeTabNavigator = () => {
  const { isLoggedIn } = useAuth();
  const { colors } = useTheme();
  
  // We don't need the Tab.Navigator anymore since we're using our custom Layout with BottomNavigator
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background }
      }}
    >
      <MainStack.Screen name="Home">
        {() => (
          <Layout>
            <HomeScreen />
          </Layout>
        )}
      </MainStack.Screen>
      <MainStack.Screen name="Profile">
        {() => (
          <Layout>
            {isLoggedIn ? <ProfileScreen /> : <LoginPromptScreen />}
          </Layout>
        )}
      </MainStack.Screen>
      <MainStack.Screen name="Settings">
        {() => (
          <Layout>
            <SettingsScreen />
          </Layout>
        )}
      </MainStack.Screen>
      <MainStack.Screen name="EditProfile">
        {() => (
          <Layout>
            <EditProfileScreen />
          </Layout>
        )}
      </MainStack.Screen>
      <MainStack.Screen name="Chat">
        {() => (
          <Layout>
            <ChatScreen />
          </Layout>
        )}
      </MainStack.Screen>
      <MainStack.Screen name="Example">
        {() => (
          <Layout>
            <ExampleScreen />
          </Layout>
        )}
      </MainStack.Screen>
    </MainStack.Navigator>
  );
};

// Login Prompt Screen - shown when user is not logged in and tries to access profile
const LoginPromptScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();
  
  return (
    <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
      <View className="w-20 h-20 rounded-full justify-center items-center mb-5" style={{ backgroundColor: colors.primary }}>
        <Ionicons name="person" size={50} color="#ffffff" />
      </View>
      <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Please Sign In</Text>
      <Text className="text-base text-center mb-8" style={{ color: colors.secondaryText }}>You need to be signed in to view your profile</Text>
      <TouchableOpacity 
        className="py-3 px-8 rounded-lg flex-row items-center justify-center"
        style={{ backgroundColor: colors.primary }}
        onPress={() => navigation.navigate('Auth' as never)}
      >
        <Ionicons name="log-in-outline" size={20} color="#ffffff" className="mr-2" />
        <Text className="text-white text-base font-bold">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main Navigator
const MainNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background }
      }}
    >
      <MainStack.Screen name="TabNavigator" component={HomeTabNavigator} />
    </MainStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isLoading, isLoggedIn } = useAuth();
  const { colors } = useTheme();

  // Show loading screen while checking login status
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;