import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ExampleScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Example Screen
      </Text>
      <Text style={[styles.description, { color: colors.secondaryText }]}>
        This is an example screen that demonstrates how to use the Layout component.
        The Layout component automatically includes a header at the top and a navigator at the bottom.
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Layout Features
        </Text>
        <Text style={[styles.cardText, { color: colors.secondaryText }]}>
          • Header at the top{'\n'}
          • Content in the middle{'\n'}
          • Navigator at the bottom{'\n'}
          • Automatic safe area handling{'\n'}
          • Theme support
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ExampleScreen; 