import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Header from '../components/Header';

// Define the item type
type Item = {
  id: number;
  title: string;
  description: string;
  color: string;
  price: string;
};

// Local array database with 30 items with realistic product names
const itemsData: Item[] = [
  { id: 1, title: 'Wireless Earbuds', description: 'Bluetooth 5.0 with noise cancellation', color: '#3498db', price: '$49.99' },
  { id: 2, title: 'Smart Watch', description: 'Fitness tracker with heart rate monitor', color: '#2ecc71', price: '$89.99' },
  { id: 3, title: 'Portable Charger', description: '10000mAh power bank for all devices', color: '#e74c3c', price: '$29.99' },
  { id: 4, title: 'Laptop Sleeve', description: 'Waterproof protective case for 15" laptops', color: '#f39c12', price: '$19.99' },
  { id: 5, title: 'Bluetooth Speaker', description: 'Waterproof with 12-hour battery life', color: '#9b59b6', price: '$39.99' },
  { id: 6, title: 'Phone Stand', description: 'Adjustable desk holder for smartphones', color: '#1abc9c', price: '$12.99' },
  { id: 7, title: 'Wireless Mouse', description: 'Ergonomic design with silent clicks', color: '#d35400', price: '$24.99' },
  { id: 8, title: 'Keyboard Cover', description: 'Silicone protector for MacBook keyboards', color: '#34495e', price: '$14.99' },
  { id: 9, title: 'USB-C Hub', description: '7-in-1 adapter with HDMI and card readers', color: '#16a085', price: '$35.99' },
  { id: 10, title: 'Desk Lamp', description: 'LED with adjustable brightness and color', color: '#27ae60', price: '$32.99' },
  { id: 11, title: 'Webcam Cover', description: 'Privacy slider for laptop cameras', color: '#c0392b', price: '$7.99' },
  { id: 12, title: 'Cable Organizer', description: 'Silicone clips for desk cable management', color: '#f1c40f', price: '$9.99' },
  { id: 13, title: 'Wireless Charger', description: 'Fast charging pad for Qi-enabled devices', color: '#8e44ad', price: '$22.99' },
  { id: 14, title: 'Screen Cleaner', description: 'Microfiber cloth with cleaning spray', color: '#2980b9', price: '$11.99' },
  { id: 15, title: 'Phone Grip', description: 'Expandable stand and grip for smartphones', color: '#e67e22', price: '$8.99' },
  { id: 16, title: 'Tablet Stand', description: 'Adjustable angle holder for iPads and tablets', color: '#7f8c8d', price: '$18.99' },
  { id: 17, title: 'Noise-Cancelling Headphones', description: 'Over-ear design with 20hr battery life', color: '#2c3e50', price: '$129.99' },
  { id: 18, title: 'Mechanical Keyboard', description: 'RGB backlit with tactile switches', color: '#3498db', price: '$79.99' },
  { id: 19, title: 'Laptop Cooling Pad', description: 'Dual fan design with height adjustment', color: '#2ecc71', price: '$25.99' },
  { id: 20, title: 'Smartphone Gimbal', description: '3-axis stabilizer for smooth video recording', color: '#e74c3c', price: '$69.99' },
  { id: 21, title: 'Desk Organizer', description: 'Multi-compartment storage for office supplies', color: '#f39c12', price: '$15.99' },
  { id: 22, title: 'Wireless Keyboard', description: 'Slim design with multi-device connectivity', color: '#9b59b6', price: '$45.99' },
  { id: 23, title: 'Monitor Stand', description: 'Height adjustable with cable management', color: '#1abc9c', price: '$32.99' },
  { id: 24, title: 'Touchscreen Gloves', description: 'Winter gloves compatible with smartphones', color: '#d35400', price: '$14.99' },
  { id: 25, title: 'Laptop Privacy Screen', description: 'Anti-spy filter for 15.6" displays', color: '#34495e', price: '$29.99' },
  { id: 26, title: 'Smart Bulb', description: 'WiFi-enabled RGB light with app control', color: '#16a085', price: '$19.99' },
  { id: 27, title: 'Wireless Presenter', description: 'Laser pointer with slide controls', color: '#27ae60', price: '$24.99' },
  { id: 28, title: 'Desk Mat', description: 'Large mousepad with microfiber surface', color: '#c0392b', price: '$17.99' },
  { id: 29, title: 'Phone Sanitizer', description: 'UV light cleaner for smartphones', color: '#f1c40f', price: '$39.99' },
  { id: 30, title: 'Webcam Light', description: 'Ring light for video calls and streaming', color: '#8e44ad', price: '$28.99' },
];

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 40) / numColumns;

const HomeScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.cardImage, { backgroundColor: item.color }]}>
        <Text style={styles.cardImageText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Featured Products</Text>
        <Text style={styles.pageSubtitle}>Browse our collection of tech accessories</Text>
      </View>
      <FlatList
        data={itemsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  titleContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    width: itemWidth,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default HomeScreen; 