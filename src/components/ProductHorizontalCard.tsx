import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      style={[
        styles.card, 
        { 
          width,
          height,
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
      onPress={() => navigation.navigate('Chat', { item })}
    >
      <View style={[
        styles.imageContainer, 
        { 
          backgroundColor: item.color,
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
        }
      ]}>
        <Text style={[
          styles.imageText,
          isSmallPhonePortrait && { fontSize: 24 }
        ]}>
          {item.title.charAt(0)}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.title, 
          { color: colors.text },
          isSmallPhonePortrait && { fontSize: 14 }
        ]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[
          styles.description, 
          { color: colors.secondaryText },
          isSmallPhonePortrait && { fontSize: 12 }
        ]} numberOfLines={isLandscape ? 1 : 2}>
          {item.description}
        </Text>
        <Text style={[
          styles.price, 
          { color: colors.primary },
          isSmallPhonePortrait && { fontSize: 14 }
        ]}>
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 5,
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

export default ProductHorizontalCard; 