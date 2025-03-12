import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../context/ProductsContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MakeOfferModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ visible, onClose, product }) => {
  const { colors } = useTheme();
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Here you would implement the logic to submit the offer
    // This could include API calls to your backend
    console.log('Offer submitted:', { productId: product.id, amount: offerAmount, message });
    
    // Reset form and close modal
    setOfferAmount('');
    setMessage('');
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Make an Offer</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.productInfo}>
              <Text style={[styles.productTitle, { color: colors.text }]}>{product.title}</Text>
              <Text style={[styles.listingPrice, { color: colors.primary }]}>
                Listed for: {product.price}
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Your Offer</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                keyboardType="decimal-pad"
                placeholder="Enter amount"
                placeholderTextColor={colors.secondaryText}
                value={offerAmount}
                onChangeText={setOfferAmount}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Message (optional)</Text>
              <TextInput
                style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
                placeholder="Add a message to the seller"
                placeholderTextColor={colors.secondaryText}
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={!offerAmount}
            >
              <Text style={styles.submitButtonText}>Submit Offer</Text>
            </TouchableOpacity>
          </View>
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
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MakeOfferModal;