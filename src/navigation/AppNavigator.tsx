import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
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
  const { colors, isDarkMode } = useTheme();
  
  return (
    <AuthStack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: false,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
          close: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: false,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
        }
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
  const { colors, isDarkMode } = useTheme();
  
  // We don't need the Tab.Navigator anymore since we're using our custom Layout with BottomNavigator
  return (
    <MainStack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 200,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 150,
            },
          },
        }
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
  const { colors, isDarkMode } = useTheme();
  
  return (
    <MainStack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: false,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
          close: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: false,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
        }
      }}
    >
      <MainStack.Screen name="TabNavigator" component={HomeTabNavigator} />
    </MainStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isLoading, isLoggedIn } = useAuth();
  const { colors, isDarkMode } = useTheme();

  // Create custom theme with proper background colors
  const customTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  // Show loading screen while checking login status
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={customTheme}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <Stack.Navigator
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyle: { backgroundColor: colors.background },
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: false,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: false,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
          }
        }}
      >
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{
            presentation: 'modal',
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            transitionSpec: {
              open: {
                animation: 'spring',
                config: {
                  stiffness: 1000,
                  damping: 500,
                  mass: 3,
                  overshootClamping: true,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 0.01,
                },
              },
              close: {
                animation: 'spring',
                config: {
                  stiffness: 1000,
                  damping: 500,
                  mass: 3,
                  overshootClamping: false,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 0.01,
                },
              },
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;