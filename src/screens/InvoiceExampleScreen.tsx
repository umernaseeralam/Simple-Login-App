import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ProductGridCard from '../components/ProductGridCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { itemsData } from '../data/ProductsData'; // Ensure this path is correct
import ProductInvoiceCard from '../components/ProductInvoiceCard';

const ExampleScreen: React.FC = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState(itemsData); // Use itemsData here
  const [sortType, setSortType] = useState('recent'); // 'recent' or 'price'
  
  // Calculate card width
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 2;
  const cardMargin = 6; // Margin for card spacing
  const cardWidth = (screenWidth - (cardMargin * 2 * numColumns) - 32) / numColumns;
  
  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSort = (type: string) => {
    setSortType(type);
    
    const sortedInvoices = [...invoices].sort((a, b) => {
      if (type === 'recent') {
      } else if (type === 'price') {
        return parseFloat(b.price.replace('$', '').replace(',', '')) - 
               parseFloat(a.price.replace('$', '').replace(',', ''));
      }
      return 0;
    });
    
    setInvoices(sortedInvoices);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          My Purchases
        </Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              sortType === 'recent' && { backgroundColor: colors.primary }
            ]} 
            onPress={() => handleSort('recent')}
          >
            <Text style={[
              styles.sortButtonText, 
              { color: sortType === 'recent' ? 'white' : colors.secondaryText }
            ]}>
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              sortType === 'price' && { backgroundColor: colors.primary }
            ]} 
            onPress={() => handleSort('price')}
          >
            <Text style={[
              styles.sortButtonText, 
              { color: sortType === 'price' ? 'white' : colors.secondaryText }
            ]}>
              Price
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Loading purchases...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {invoices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color={colors.secondaryText} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No purchases yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
                Items you buy will appear here
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {invoices.map(item => (
                <View key={item.id} style={styles.gridItem}>
                  <ProductInvoiceCard 
                    item={{...item, purchaseDate: item.purchaseDate || '', invoiceStatus: item.invoiceStatus || ''}} 
                    width={cardWidth} 
                    colors={colors}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 20,
    position: 'relative',
  },
  dateBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  }
});

export default ExampleScreen;