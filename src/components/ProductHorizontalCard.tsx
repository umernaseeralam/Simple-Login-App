import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Item } from './ProductGridCard';

interface ProductHorizontalCardProps {
  item: Item;
  width: number;
  height: number;
  isLandscape: boolean;
  isSmallPhonePortrait?: boolean;
  colors: {
    card: string;
    text: string;
    border: string;
    secondaryText: string;
    primary: string;
  };
}

const ProductHorizontalCard: React.FC<ProductHorizontalCardProps> = memo(({ 
  item, 
  width, 
  height, 
  isLandscape, 
  isSmallPhonePortrait = false,
  colors 
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const imageSize = height * 0.8;

  return (
    <TouchableOpacity 
      className="flex-row items-center mr-4 rounded-lg border p-2.5 bg-white dark:bg-gray-800"
      style={{ 
        width,
        height,
        borderColor: colors.border,
      }}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View 
        className="justify-center items-center mr-2.5 rounded-full"
        style={{ 
          backgroundColor: item.color,
          width: imageSize,
          height: imageSize,
        }}
      >
        <Text 
          className={`font-bold text-white ${isSmallPhonePortrait ? 'text-2xl' : 'text-3xl'}`}
        >
          {item.title.charAt(0)}
        </Text>
      </View>
      <View className="flex-1 justify-between h-full py-1.5">
        <Text 
          className={`font-bold mb-1 text-gray-800 dark:text-gray-200 ${isSmallPhonePortrait ? 'text-sm' : 'text-base'}`}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text 
          className={`mb-1 text-gray-500 ${isSmallPhonePortrait ? 'text-xs' : 'text-sm'}`}
          numberOfLines={isLandscape ? 1 : 2}
        >
          {item.description}
        </Text>
        <Text 
          className={`font-bold text-blue-500 ${isSmallPhonePortrait ? 'text-sm' : 'text-base'}`}
        >
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ProductHorizontalCard; 