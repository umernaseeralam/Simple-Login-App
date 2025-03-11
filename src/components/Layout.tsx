import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Header from './Header';
import BottomNavigator from '../components/BottomNavigator';

type LayoutProps = {
  children: ReactNode;
  showHeader?: boolean;
  showNavigator?: boolean;
  showProfileButton?: boolean;
  contentStyle?: object;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showNavigator = true,
  showProfileButton = true,
  contentStyle = {},
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colors.background }
      ]}
    >
      {/* Header */}
      {showHeader && <Header showProfileButton={showProfileButton} />}

      {/* Main Content */}
      <View 
        style={[
          styles.content,
          contentStyle
        ]}
      >
        {children}
      </View>

      {/* Bottom Navigator */}
      {showNavigator && <BottomNavigator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout; 