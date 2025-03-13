import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  GestureResponderEvent,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { fetchBrands, searchBrands } from '../utils/api';

interface Brand {
  id: string;
  name: string;
}

interface BrandsInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
}

const BrandsInput: React.FC<BrandsInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search for brand',
  label
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<TextInput>(null);
  const suggestionsRef = useRef<View>(null);
  const shouldHideSuggestions = useRef(false);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Fetch brands from API
  const loadBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBrands();
      setBrands(data);
      setFilteredBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter brands based on input text
  const handleInputChange = (text: string) => {
    onChangeText(text);
    setSearchText(text);
    if (text.trim()) {
      const filtered = searchBrands(text, brands);
      setFilteredBrands(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle brand selection from suggestions or modal
  const handleSelectBrand = (brand: Brand) => {
    onChangeText(brand.name);
    setShowSuggestions(false);
    setModalVisible(false);
    Keyboard.dismiss();
  };

  // Open modal with all brands
  const handleOpenModal = () => {
    setModalVisible(true);
    setSearchText('');
    setFilteredBrands(brands);
  };

  // Modified blur handler to prevent hiding suggestions when tapping on them
  const handleInputBlur = () => {
    // Only hide suggestions if we're not selecting an item
    // We use a short delay to allow click events on suggestions to complete
    setTimeout(() => {
      if (shouldHideSuggestions.current) {
        setShowSuggestions(false);
        shouldHideSuggestions.current = false;
      }
    }, 200);
  };

  // Handle touch start to track when to hide suggestions
  const handleSuggestionTouch = (e: GestureResponderEvent) => {
    e.stopPropagation();
    shouldHideSuggestions.current = false;
  };

  // Set up component to hide suggestions on blur
  useEffect(() => {
    shouldHideSuggestions.current = true;
  }, []);

  // Render individual suggestion item
  const renderSuggestionItem = (item: Brand) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectBrand(item)}
      onPressIn={() => {
        shouldHideSuggestions.current = false;
      }}
    >
      <Text style={{ color: colors.text }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="px-4 py-3">
      {label && <Text className="mb-2 text-gray-500">{label}</Text>}
      <View className="flex-row items-center">
        <View className="flex-1">
          <TextInput
            ref={inputRef}
            className="h-12 border border-gray-200 rounded-md px-3"
            value={value}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor={colors.secondaryText}
            onBlur={handleInputBlur}
            onFocus={() => {
              shouldHideSuggestions.current = false;
              if (value.trim()) setShowSuggestions(true);
            }}
          />
          {showSuggestions && filteredBrands.length > 0 && (
            <View 
              ref={suggestionsRef}
              style={[styles.suggestionsContainer, { backgroundColor: colors.background }]}
              onTouchStart={handleSuggestionTouch}
            >
              {/* Replace FlatList with direct mapping of items to avoid nesting VirtualizedLists */}
              {filteredBrands.slice(0, 5).map(item => (
                <React.Fragment key={item.id}>
                  {renderSuggestionItem(item)}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity
          className="ml-2 h-12 w-12 border border-gray-200 rounded-md justify-center items-center"
          onPress={handleOpenModal}
        >
          <Ionicons name="search" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Brand</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { borderColor: colors.border }]}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setFilteredBrands(searchBrands(text, brands));
              }}
              placeholder="Search brands..."
              placeholderTextColor={colors.secondaryText}
              autoFocus
            />
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.text, marginTop: 10 }}>Loading brands...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={{ color: 'red' }}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={loadBrands}
              >
                <Text style={{ color: 'white' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredBrands}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.brandItem}
                  onPress={() => handleSelectBrand(item)}
                >
                  <Text style={{ color: colors.text }}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{ color: colors.secondaryText }}>
                    No brands found matching "{searchText}"
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  suggestionsContainer: {
    position: 'absolute',
    top: 48, // height of input + small gap
    left: 0,
    right: 0,
    maxHeight: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    marginTop: height * 0.15,
    marginHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  brandItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default BrandsInput;