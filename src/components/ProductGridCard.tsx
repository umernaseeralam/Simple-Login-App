import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Define the item type
export type Item = {
  id: number;
  title: string;
  description: string;
  color: string;
  price: string;
};

interface ProductGridCardProps {
  item: Item;
  width: number;
  colors: {
    card: string;
    text: string;
    border: string;
    secondaryText: string;
    primary: string;
  };
}

const ProductGridCard: React.FC<ProductGridCardProps> = memo(({ item, width, colors }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity 
      key={item.id}
      style={[
        styles.gridCard, 
        { 
          width: width,
          backgroundColor: colors.card,
          shadowColor: colors.text,
          borderColor: colors.border,
        }
      ]}
      onPress={() => navigation.navigate('Chat', { item })}
    >
      <View style={[styles.cardImage, { backgroundColor: item.color }]}>
        <Text style={styles.cardImageText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.cardDescription, { color: colors.secondaryText }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.cardPrice, { color: colors.primary }]}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  gridCard: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 10,
  },
  cardImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductGridCard; 