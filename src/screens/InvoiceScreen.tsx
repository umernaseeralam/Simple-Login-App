import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../context/ProductsContext';

type InvoiceRouteProp = RouteProp<{ Invoice: { product: Product } }, 'Invoice'>;

const InvoiceScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<InvoiceRouteProp>();
  const { product } = route.params;
  
  const currentDate = new Date();
  const issueDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const invoiceNumber = `BW-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calculate due date (10 days from now)
  const dueDate = new Date(currentDate);
  dueDate.setDate(dueDate.getDate() + 10);
  const dueDateFormatted = dueDate.toISOString().split('T')[0];
  
  // Calculate taxes and total
  const productPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  const tax = productPrice * 0.07; // 7% tax
  const total = productPrice + tax;

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Brickell Watches</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Company Information */}
        <View style={styles.companySection}>
          <View style={styles.companyInfo}>
            <Text style={[styles.companyName, { color: colors.text }]}>Brickell Watches</Text>
            <Text style={[styles.companyAddress, { color: colors.secondaryText }]}>
              The Historic Alfred I. duPont Building
            </Text>
            <Text style={[styles.companyAddress, { color: colors.secondaryText }]}>
              169 E Flagler St, Suite 922, MIAMI, FL 33131
            </Text>
            <Text style={[styles.companyAddress, { color: colors.secondaryText }]}>
              United States
            </Text>
            <View style={styles.contactRow}>
              <Text
                style={[styles.emailLink, { color: colors.primary }]}
                onPress={() => {}}
              >
                info@brickelljewelers.com
              </Text>
              <Text style={[styles.companyPhone, { color: colors.text }]}>
                | 305-381-7705
              </Text>
            </View>
          </View>
          <View style={styles.logoContainer}>
            <View className='bg-emerald-700' style={styles.logo}>
              <Image source={require('../../assets/splash_icon.png')} style={styles.logoImage} />
            </View>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.invoiceRow}>
            <Text style={[styles.invoiceLabel, { color: colors.secondaryText }]}>Issue Date: {issueDate}</Text>
            <Text style={[styles.invoiceNumber, { color: colors.text }]}>Invoice #{invoiceNumber}</Text>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadText}>Download PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Options */}
        <View style={[styles.paymentOptions, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <Text style={[styles.paymentTitle, { color: colors.text }]}>PAYMENT OPTIONS: Brickell Watches</Text>
          
          <View style={styles.paymentList}>
            <Text style={[styles.paymentItem, { color: colors.text }]}>1. Do NOT pay this invoice with credit card</Text>
            <Text style={[styles.paymentItem, { color: colors.text }]}>2. Do NOT mail a check unless express mail with tracking.</Text>
            <Text style={[styles.paymentItem, { color: colors.text }]}>3. Cash</Text>
            <Text style={[styles.paymentItem, { color: colors.text }]}>
              4. Bank of America: Acct 898092724661, Wires 026009593, Paper & Electronic payment (for example: direct deposits, automatic payments and ACH transfers) 063100277, Swift Code BOFAUS3N
            </Text>
            <View style={styles.paymentItemRow}>
              <Text style={[styles.paymentItem, { color: colors.text }]}>5. eCheck to </Text>
              <Text style={[styles.paymentLink, { color: colors.primary }]}>info@brickelljewelers.com</Text>
            </View>
            <View style={styles.paymentItemRow}>
              <Text style={[styles.paymentItem, { color: colors.text }]}>6. Zelle is </Text>
              <Text style={[styles.paymentLink, { color: colors.primary }]}>info@brickelljewelers.com</Text>
            </View>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.customerSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Details</Text>
          <Text style={[styles.customerName, { color: colors.text }]}>Test Queen</Text>
          <Text style={[styles.customerEmail, { color: colors.secondaryText }]}>smart.aali@yahoo.com</Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Payment</Text>
          <Text style={[styles.paymentDate, { color: colors.secondaryText }]}>Due {dueDateFormatted}</Text>
          <Text style={[styles.paymentAmount, { color: colors.text }]}>${total.toFixed(2)}</Text>
        </View>

        {/* Invoice Items */}
        <View style={[styles.invoiceItems, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <View style={styles.invoiceTableHeader}>
            <Text style={[styles.tableHeaderPhoto, { color: colors.secondaryText }]}>Photo</Text>
            <Text style={[styles.tableHeaderItems, { color: colors.secondaryText }]}>Items</Text>
            <Text style={[styles.tableHeaderPrice, { color: colors.secondaryText }]}>Price</Text>
            <Text style={[styles.tableHeaderTotal, { color: colors.secondaryText }]}>Total</Text>
          </View>
          
          <View style={styles.invoiceTableRow}>
            <View style={styles.productImageContainer}>
              {/* <Image 
                source={product.image} 
                style={styles.productImage}
              /> */}
              <View className='w-10 h-10 bg-gray-300 rounded-full mr-10'>
                
              </View>
            </View>
            <Text style={[styles.productTitle, { color: colors.text }]}>{product.title}</Text>
            <Text style={[styles.productPrice, { color: colors.text }]}>${productPrice.toFixed(2)}</Text>
            <Text style={[styles.productTotal, { color: colors.text }]}>${productPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Subtotal:</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>${productPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Tax (7%):</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>${total.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  companySection: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  companyInfo: {
    flex: 3,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  companyAddress: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  emailLink: {
    fontSize: 14,
  },
  companyPhone: {
    fontSize: 14,
    marginLeft: 4,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  invoiceDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 14,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    alignSelf: 'flex-end',
  },
  downloadText: {
    color: '#007AFF',
    fontSize: 14,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  paymentOptions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentList: {
    marginTop: 4,
  },
  paymentItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  paymentItemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paymentLink: {
    fontSize: 14,
  },
  customerSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
  },
  customerEmail: {
    fontSize: 14,
  },
  paymentDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  invoiceItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  invoiceTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F7',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tableHeaderPhoto: {
    flex: 1,
    fontSize: 14,
  },
  tableHeaderItems: {
    flex: 2,
    fontSize: 14,
  },
  tableHeaderPrice: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  tableHeaderTotal: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  invoiceTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  productImageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  productTitle: {
    flex: 2,
    fontSize: 14,
  },
  productPrice: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  productTotal: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  totalSection: {
    padding: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default InvoiceScreen;