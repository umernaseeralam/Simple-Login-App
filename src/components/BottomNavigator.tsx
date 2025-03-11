import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

type BottomNavigatorProps = {
  // Add any props if needed
};

type NavItem = {
  name: string;
  icon: string;
  activeIcon: string;
  screen: string;
};

const BottomNavigator: React.FC<BottomNavigatorProps> = () => {
  // Using any type to avoid TypeScript errors with navigation
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const route = useRoute();

  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', screen: 'Home' },
    { name: 'Example', icon: 'apps-outline', activeIcon: 'apps', screen: 'Example' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', screen: 'Profile' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings', screen: 'Settings' },
  ];

  // Get current route name to highlight active tab
  const currentRoute = route.name;

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10
        }
      ]}
    >
      {navItems.map((item) => {
        const isActive = currentRoute === item.screen;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => {
              navigation.navigate(item.screen);
            }}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={24}
              color={isActive ? colors.primary : colors.secondaryText}
            />
            <Text
              style={[
                styles.navText,
                { color: isActive ? colors.primary : colors.secondaryText }
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigator;