import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../context/ProductsContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BuyNowModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ visible, onClose, product }) => {
  const { colors } = useTheme();

  const handlePurchase = () => {
    // Here you would implement the logic to complete the purchase
    // This could include API calls to your backend, payment processing, etc.
    console.log('Purchase initiated for product:', product.id);
    
    // Close modal after purchase logic
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalView, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Buy Now</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.productInfo}>
                <Text style={[styles.productTitle, { color: colors.text }]}>{product.title}</Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>
                  {product.price}
                </Text>
              </View>
              
              <View style={styles.confirmationSection}>
                <Text style={[styles.confirmationText, { color: colors.text }]}>
                  You are about to purchase this item at the listed price. Continue to payment?
                </Text>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
                  onPress={handlePurchase}
                >
                  <Text style={[styles.buttonText, { color: 'white' }]}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productInfo: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  confirmationSection: {
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BuyNowModal;