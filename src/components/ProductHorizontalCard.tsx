import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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

const ProductHorizontalCard: React.FC<ProductHorizontalCardProps> = ({ 
  item, 
  width, 
  height, 
  isLandscape, 
  isSmallPhonePortrait = false,
  colors 
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const imageWidth = isLandscape ? 100 : (isSmallPhonePortrait ? 80 : 120);

  return (
    <TouchableOpacity 
      key={item.id}
      style={[
        styles.horizontalCard, 
        { 
          width: width,
          height: height,
          backgroundColor: colors.card,
          shadowColor: colors.text,
          borderColor: colors.border,
        }
      ]}
      onPress={() => navigation.navigate('Chat', { item })}
    >
      <View style={[
        styles.horizontalCardImage, 
        { 
          backgroundColor: item.color,
          width: imageWidth 
        }
      ]}>
        <Text style={[
          styles.cardImageText,
          isSmallPhonePortrait && { fontSize: 28 }
        ]}>
          {item.title.charAt(0)}
        </Text>
      </View>
      <View style={styles.horizontalCardContent}>
        <Text style={[
          styles.cardTitle, 
          { color: colors.text },
          isSmallPhonePortrait && { fontSize: 14, marginBottom: 2 }
        ]}>
          {item.title}
        </Text>
        <Text 
          style={[
            styles.cardDescription, 
            { color: colors.secondaryText },
            isSmallPhonePortrait && { fontSize: 12, marginBottom: 2 }
          ]} 
          numberOfLines={isLandscape ? 1 : 2}
        >
          {item.description}
        </Text>
        <Text style={[
          styles.cardPrice, 
          { color: colors.primary },
          isSmallPhonePortrait && { fontSize: 14 }
        ]}>
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    marginRight: 15,
  },
  horizontalCardImage: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalCardContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
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

export default ProductHorizontalCard; 