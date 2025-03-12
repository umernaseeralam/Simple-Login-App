import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../context/ProductsContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProductDetailRouteProp = RouteProp<{ ProductDetail: { product: Product } }, 'ProductDetail'>;

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const DetailItem: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => {
  const { colors } = useTheme();
  if (!value) return null;
  
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>{label}:</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
};

const ProductDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;

  const isOwner = user?.id === product.ownerId;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Product Details</Text>
        {isOwner ? (
          <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { product })}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { item: product })}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Product Image/Color */}
        <View style={[styles.imageContainer, { backgroundColor: product.color }]}>
          {product.images && product.images.length > 0 ? (
            <Image source={{ uri: product.images[0] }} style={styles.productImage} />
          ) : (
            <Text style={styles.productInitial}>{product.title.charAt(0)}</Text>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <Text style={[styles.productTitle, { color: colors.text }]}>{product.title}</Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>{product.price}</Text>
          {product.description && (
            <Text style={[styles.productDescription, { color: colors.secondaryText }]}>
              {product.description}
            </Text>
          )}
        </View>

        {/* Brand */}
        {product.brand && (
          <DetailSection title="Brand">
            <Text style={[styles.brandText, { color: colors.text }]}>{product.brand}</Text>
          </DetailSection>
        )}

        {/* Comes With */}
        {product.comesWith && product.comesWith.length > 0 && (
          <DetailSection title="Comes With">
            <View style={styles.comesWithContainer}>
              {product.comesWith.map((item, index) => (
                <View key={index} style={[styles.comesWithItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.comesWithText, { color: colors.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          </DetailSection>
        )}

        {/* Watch Info */}
        {product.watchInfo && (
          <DetailSection title="Watch Information">
            <DetailItem label="Model" value={product.watchInfo.model} />
            <DetailItem label="Reference" value={product.watchInfo.ref} />
            <DetailItem label="Serial" value={product.watchInfo.serial} />
            <DetailItem label="Year" value={product.watchInfo.year} />
            <DetailItem label="Time Score" value={product.watchInfo.timeScore} />
          </DetailSection>
        )}

        {/* Condition */}
        {(product.condition || product.polish || product.crystal || 
          product.dial || product.bezel || product.movement || product.bracelet) && (
          <DetailSection title="Condition">
            <DetailItem label="Overall Condition" value={product.condition} />
            <DetailItem label="Polish" value={product.polish} />
            <DetailItem label="Crystal" value={product.crystal} />
            <DetailItem label="Dial" value={product.dial} />
            <DetailItem label="Bezel" value={product.bezel} />
            <DetailItem label="Movement" value={product.movement} />
            <DetailItem label="Bracelet" value={product.bracelet} />
          </DetailSection>
        )}

        {/* Additional Notes */}
        {product.additionalNotes && (
          <DetailSection title="Additional Notes">
            <Text style={[styles.notesText, { color: colors.text }]}>{product.additionalNotes}</Text>
          </DetailSection>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInitial: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
  },
  basicInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    marginLeft: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  brandText: {
    fontSize: 16,
  },
  comesWithContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  comesWithItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  comesWithText: {
    fontSize: 14,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProductDetailScreen; 