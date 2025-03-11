import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Item } from './ProductGridCard';

interface ProductListCardProps {
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

const ProductListCard: React.FC<ProductListCardProps> = memo(({ item, width, colors }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const imageSize = 70; // Fixed size for the image/icon

  return (
    <TouchableOpacity
      className="m-1.5 rounded-lg border overflow-hidden flex-row"
      style={{
        width: width - 15, // Adjust for margins
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      onPress={() => navigation.navigate('Chat', { item })}
    >
      <View
        className="justify-center items-center"
        style={{
          backgroundColor: item.color,
          width: imageSize,
          height: imageSize,
        }}
      >
        <Text className="text-2xl text-white font-bold">{item.title.charAt(0)}</Text>
      </View>
      <View className="p-2.5 flex-1 justify-between">
        <View className="flex-row justify-between items-start">
          <Text 
            className="text-base font-bold flex-1 mr-2" 
            style={{ color: colors.text }} 
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text 
            className="text-base font-bold" 
            style={{ color: colors.primary }}
          >
            {item.price}
          </Text>
        </View>
        <Text 
          className="text-sm mt-1 text-gray-500" 
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ProductListCard; 