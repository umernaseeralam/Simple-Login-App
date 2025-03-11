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
      className="flex-row items-center mr-4 rounded-lg border p-2.5"
      style={{ 
        width,
        height,
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      onPress={() => navigation.navigate('Chat', { item })}
    >
      <View 
        className="justify-center items-center mr-2.5"
        style={{ 
          backgroundColor: item.color,
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
        }}
      >
        <Text 
          className="font-bold text-white"
          style={{
            fontSize: isSmallPhonePortrait ? 24 : 32
          }}
        >
          {item.title.charAt(0)}
        </Text>
      </View>
      <View className="flex-1 justify-between h-full py-1.5">
        <Text 
          className="font-bold mb-1"
          style={{
            color: colors.text,
            fontSize: isSmallPhonePortrait ? 14 : 16
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text 
          className="mb-1"
          style={{
            color: colors.secondaryText,
            fontSize: isSmallPhonePortrait ? 12 : 14
          }}
          numberOfLines={isLandscape ? 1 : 2}
        >
          {item.description}
        </Text>
        <Text 
          className="font-bold"
          style={{
            color: colors.primary,
            fontSize: isSmallPhonePortrait ? 14 : 16
          }}
        >
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ProductHorizontalCard; 