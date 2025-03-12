import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      className="m-1.5 rounded-lg border overflow-hidden bg-white dark:bg-gray-800"
      style={{
        width,
        height: cardHeight,
        borderColor: colors.border,
      }}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View
        className="justify-center items-center"
        style={{
          backgroundColor: item.color,
          height: cardHeight * 0.6,
        }}
      >
        <Text className="text-5xl text-white font-bold">{item.title.charAt(0)}</Text>
      </View>
      <View className="p-2.5 flex-1 justify-between">
        <Text 
          className="text-base font-bold mb-1 text-gray-800 dark:text-gray-200" 
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text 
          className="text-sm mb-1 text-gray-500" 
          numberOfLines={1}
        >
          {item.description}
        </Text>
        <Text 
          className="text-base font-bold text-blue-500" 
        >
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ProductGridCard; 