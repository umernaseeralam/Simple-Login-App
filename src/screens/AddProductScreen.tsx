import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductsContext';
import { RootStackParamList } from '../navigation/AppNavigator';

// Component for section headers
export const SectionHeader: React.FC<{ title: string; required?: boolean }> = ({ title, required = false }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeaderText, { color: colors.text }]}>
        {title}
      </Text>
      {required && <Text style={{ color: 'red' }}> *Required</Text>}
    </View>
  );
};

// Component for form fields
export const FormField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}> = ({ label, value, onChangeText, placeholder = 'Type Here', multiline = false, keyboardType = 'default' }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
            height: multiline ? 100 : 40,
            textAlignVertical: multiline ? 'top' : 'center'
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
};

// Component for option buttons (New, Seller, Preowned, Needs Service)
export const OptionButtons: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
}> = ({ options, selectedOption, onSelect }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            { 
              backgroundColor: selectedOption === option ? colors.primary : 'transparent',
              borderColor: colors.border
            }
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              { color: selectedOption === option ? '#fff' : colors.secondaryText }
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const AddProductScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [comesWith, setComesWith] = useState<string[]>([]);
  const [comesWithText, setComesWithText] = useState('');
  const [condition, setCondition] = useState<string | null>(null);
  const [polish, setPolish] = useState<string | null>(null);
  const [crystal, setCrystal] = useState<string | null>(null);
  const [dial, setDial] = useState<string | null>(null);
  const [bezel, setBezel] = useState<string | null>(null);
  const [bracelet, setBracelet] = useState<string | null>(null);
  const [movement, setMovement] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Watch info
  const [model, setModel] = useState('');
  const [ref, setRef] = useState('');
  const [serial, setSerial] = useState('');
  const [year, setYear] = useState('');
  const [timeScore, setTimeScore] = useState('');
  
  // Images
  const [images, setImages] = useState<string[]>([]);

  // Options for condition and other fields
  const conditionOptions = ['New', 'Seller', 'Preowned', 'Needs Service'];
  const polishOptions = ['Unpolished', 'Needs Polish', 'Preowned', 'Needs Service'];
  const crystalOptions = ['New', 'Seller', 'Preowned', 'Needs Service'];
  const dialOptions = ['New', 'Seller', 'Preowned', 'Needs Service'];
  const bezelOptions = ['New', 'Seller', 'Preowned', 'Needs Service'];
  const braceletOptions = ['New', 'Seller', 'Preowned', 'Needs Service'];
  const movementOptions = ['New', 'Seller', 'Preowned', 'Needs Service'];

  const handleAddImage = () => {
    // In a real app, this would open the image picker
    Alert.alert('Add Image', 'This would open the image picker in a real app');
  };

  const handleAddComesWithItem = () => {
    if (comesWithText.trim()) {
      setComesWith([...comesWith, comesWithText.trim()]);
      setComesWithText('');
    }
  };

  const handleRemoveComesWithItem = (index: number) => {
    setComesWith(comesWith.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a product title');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Error', 'Please enter a price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the product object
      const newProduct = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim().startsWith('$') ? price.trim() : `$${price.trim()}`,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
        brand: brand.trim(),
        comesWith: comesWith.length > 0 ? comesWith : undefined,
        watchInfo: {
          model: model.trim(),
          ref: ref.trim(),
          serial: serial.trim(),
          year: year.trim(),
          timeScore: timeScore.trim(),
        },
        condition: condition || undefined,
        polish: polish || undefined,
        crystal: crystal || undefined,
        dial: dial || undefined,
        bezel: bezel || undefined,
        movement: movement || undefined,
        bracelet: bracelet || undefined,
        additionalNotes: additionalNotes.trim(),
        images: images.length > 0 ? images : undefined,
      };

      await addProduct(newProduct);
      Alert.alert('Success', 'Product added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Listing</Text>
        <TouchableOpacity 
          style={[styles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {isSubmitting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Adding product...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Images Section */}
          <View style={styles.imagesSection}>
            <TouchableOpacity 
              style={[styles.addImageButton, { borderColor: colors.border }]}
              onPress={handleAddImage}
            >
              <Ionicons name="camera-outline" size={24} color={colors.secondaryText} />
              <Text style={[styles.addImageText, { color: colors.secondaryText }]}>Add more photos</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Info Section */}
          <SectionHeader title="Brand" required />
          <FormField 
            label="Search for brand"
            value={brand}
            onChangeText={setBrand}
          />

          <SectionHeader title="Title" required />
          <FormField 
            label="Product Title"
            value={title}
            onChangeText={setTitle}
          />

          <SectionHeader title="Description" />
          <FormField 
            label="Product Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />

          <SectionHeader title="Comes with" />
          <View style={styles.comesWithContainer}>
            <View style={styles.comesWithInputContainer}>
              <TextInput
                style={[
                  styles.comesWithInput,
                  { 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  }
                ]}
                value={comesWithText}
                onChangeText={setComesWithText}
                placeholder="Add item"
                placeholderTextColor={colors.secondaryText}
              />
              <TouchableOpacity 
                style={[styles.addComesWithButton, { backgroundColor: colors.primary }]}
                onPress={handleAddComesWithItem}
              >
                <Text style={styles.addComesWithButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {comesWith.length > 0 && (
              <View style={styles.comesWithItemsContainer}>
                {comesWith.map((item, index) => (
                  <View key={index} style={[styles.comesWithItem, { backgroundColor: colors.card }]}>
                    <Text style={[styles.comesWithItemText, { color: colors.text }]}>{item}</Text>
                    <TouchableOpacity onPress={() => handleRemoveComesWithItem(index)}>
                      <Ionicons name="close-circle" size={18} color={colors.secondaryText} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <SectionHeader title="Pricing" required />
          <FormField 
            label="Asking Price"
            value={price}
            onChangeText={setPrice}
            placeholder="$0"
            keyboardType="numeric"
          />

          <SectionHeader title="Watch Info" />
          <FormField 
            label="Model"
            value={model}
            onChangeText={setModel}
          />
          <FormField 
            label="Ref"
            value={ref}
            onChangeText={setRef}
          />
          <FormField 
            label="Serial"
            value={serial}
            onChangeText={setSerial}
          />
          <FormField 
            label="Year"
            value={year}
            onChangeText={setYear}
          />
          <FormField 
            label="Time Score"
            value={timeScore}
            onChangeText={setTimeScore}
          />

          <SectionHeader title="Condition" />
          <OptionButtons 
            options={conditionOptions}
            selectedOption={condition}
            onSelect={setCondition}
          />

          <SectionHeader title="Polish" />
          <OptionButtons 
            options={polishOptions}
            selectedOption={polish}
            onSelect={setPolish}
          />

          <SectionHeader title="Crystal" />
          <OptionButtons 
            options={crystalOptions}
            selectedOption={crystal}
            onSelect={setCrystal}
          />

          <SectionHeader title="Dial" />
          <OptionButtons 
            options={dialOptions}
            selectedOption={dial}
            onSelect={setDial}
          />

          <SectionHeader title="Bezel" />
          <OptionButtons 
            options={bezelOptions}
            selectedOption={bezel}
            onSelect={setBezel}
          />

          <SectionHeader title="Movement" />
          <OptionButtons 
            options={movementOptions}
            selectedOption={movement}
            onSelect={setMovement}
          />

          <SectionHeader title="Bracelet" />
          <OptionButtons 
            options={braceletOptions}
            selectedOption={bracelet}
            onSelect={setBracelet}
          />

          <SectionHeader title="Additional Notes" />
          <TextInput
            style={[
              styles.notesInput,
              { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              }
            ]}
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="Type additional notes here"
            placeholderTextColor={colors.secondaryText}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.bottomPadding} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  submitButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
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
  imagesSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addImageButton: {
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  sectionHeaderText: {
    fontWeight: 'bold',
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fieldLabel: {
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  comesWithContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  comesWithInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comesWithInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addComesWithButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addComesWithButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comesWithItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  comesWithItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  comesWithItemText: {
    marginRight: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
  },
  notesInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    margin: 16,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 40,
  },
});

export { styles };

export default AddProductScreen; 