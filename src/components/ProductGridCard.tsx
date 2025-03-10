import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export interface Item {
  id: number;
  title: string;
  description: string;
  color: string;
  price: string;
}

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
  const cardHeight = width * 1.2; // Maintain aspect ratio

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width,
          height: cardHeight,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => navigation.navigate('Chat', { item })}
    >
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: item.color,
            height: cardHeight * 0.6,
          },
        ]}
      >
        <Text style={styles.imageText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductGridCard; 