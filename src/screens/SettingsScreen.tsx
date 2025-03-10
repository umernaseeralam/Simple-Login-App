import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme, ThemeType } from '../context/ThemeContext';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  const themeOptions: { label: string; value: ThemeType; icon: string }[] = [
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showProfileButton={true} />
      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={styles.themeOptions}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: theme === option.value ? colors.primary + '20' : 'transparent',
                    borderColor: theme === option.value ? colors.primary : colors.border
                  }
                ]}
                onPress={() => toggleTheme(option.value)}
              >
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={theme === option.value ? colors.primary : colors.secondaryText}
                  style={styles.themeIcon}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    { color: theme === option.value ? colors.primary : colors.text }
                  ]}
                >
                  {option.label}
                </Text>
                {theme === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.aboutText, { color: colors.secondaryText }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  themeOptions: {
    gap: 10,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeIcon: {
    marginRight: 12,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default SettingsScreen; 