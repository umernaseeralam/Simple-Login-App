import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../context/ProductsContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import MakeOfferModal from '../components/MakeOfferModal';
import BuyNowModal from '../components/BuyNowModal';

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
    <View className='border-b border-gray-200' style={[styles.detailItem]}>
      <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>{label}:</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
};

const ProductDetailScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;
  
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const isOwner = user?.id === product.ownerId;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
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
        <View style={[styles.basicInfo, { borderBottomColor: '#e5e7eb' }]}>
          <Text style={[styles.productTitle, { color: colors.text }]}>{product.title}</Text>
          
          {/* Comes With - Directly under title as pill buttons only */}
          {product.comesWith && product.comesWith.length > 0 && (
            <View style={styles.comesWithRow}>
              {product.comesWith.map((item, index) => (
                <View key={index} style={[styles.comesWithItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.comesWithText, { color: colors.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          )}
          
          <Text style={[styles.productPrice, { color: colors.primary }]}>{product.price}</Text>
          {product.description && (
            <Text style={[styles.productDescription, { color: colors.secondaryText }]}>
              {product.description}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        {!isOwner && (
          <View style={[styles.actionButtonsContainer, { borderBottomColor: '#e5e7eb' }]}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.offerButton, { borderColor: colors.primary }]} 
              onPress={() => setShowOfferModal(true)}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Make Offer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.buyButton, { backgroundColor: colors.primary }]} 
              onPress={() => setShowBuyModal(true)}
            >
              <Text style={[styles.actionButtonText, { color: 'white' }]}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Combined Watch Info and Condition */}
        {(product.watchInfo || product.condition || product.polish || product.crystal || 
          product.dial || product.bezel || product.movement || product.bracelet) && (
          <DetailSection title="Product Details">
            {/* Watch Info */}
            {product.watchInfo && (
              <>
                <DetailItem label="Brand" value={product.brand} />
                <DetailItem label="Model" value={product.watchInfo.model} />
                <DetailItem label="Reference" value={product.watchInfo.ref} />
                <DetailItem label="Serial" value={product.watchInfo.serial} />
                <DetailItem label="Year" value={product.watchInfo.year} />
                <DetailItem label="Time Score" value={product.watchInfo.timeScore} />
              </>
            )}
            
            {/* Condition */}
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

      {/* Modals */}
      <MakeOfferModal 
        visible={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        product={product}
      />

      <BuyNowModal
        visible={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        product={product}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    borderBottomColor: '#e5e7eb',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  comesWithRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  offerButton: {
    borderWidth: 1,
  },
  buyButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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