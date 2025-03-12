import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useProducts, Product } from '../context/ProductsContext';
import { RootStackParamList } from '../navigation/AppNavigator';

// Import components from AddProductScreen
import AddProductScreen, { 
  SectionHeader, 
  FormField, 
  OptionButtons,
  styles as addProductStyles
} from './AddProductScreen';

type EditProductRouteProp = RouteProp<{ EditProduct: { product: Product } }, 'EditProduct'>;

const EditProductScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditProductRouteProp>();
  const { product } = route.params;
  const { updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price || '');
  const [brand, setBrand] = useState(product.brand || '');
  const [comesWith, setComesWith] = useState<string[]>(product.comesWith || []);
  const [comesWithText, setComesWithText] = useState('');
  const [condition, setCondition] = useState<string | null>(product.condition || null);
  const [polish, setPolish] = useState<string | null>(product.polish || null);
  const [crystal, setCrystal] = useState<string | null>(product.crystal || null);
  const [dial, setDial] = useState<string | null>(product.dial || null);
  const [bezel, setBezel] = useState<string | null>(product.bezel || null);
  const [bracelet, setBracelet] = useState<string | null>(product.bracelet || null);
  const [movement, setMovement] = useState<string | null>(product.movement || null);
  const [additionalNotes, setAdditionalNotes] = useState(product.additionalNotes || '');
  
  // Watch info
  const [model, setModel] = useState(product.watchInfo?.model || '');
  const [ref, setRef] = useState(product.watchInfo?.ref || '');
  const [serial, setSerial] = useState(product.watchInfo?.serial || '');
  const [year, setYear] = useState(product.watchInfo?.year || '');
  const [timeScore, setTimeScore] = useState(product.watchInfo?.timeScore || '');
  
  // Images
  const [images, setImages] = useState<string[]>(product.images || []);

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
      // Create the updated product object
      const updatedProduct: Product = {
        ...product,
        title: title.trim(),
        description: description.trim(),
        price: price.trim().startsWith('$') ? price.trim() : `$${price.trim()}`,
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

      await updateProduct(updatedProduct);
      Alert.alert('Success', 'Product updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[addProductStyles.container, { backgroundColor: colors.background }]}>
      <View style={addProductStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[addProductStyles.headerTitle, { color: colors.text }]}>Edit Product</Text>
        <TouchableOpacity 
          style={[addProductStyles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={addProductStyles.submitButtonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {isSubmitting ? (
        <View style={addProductStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[addProductStyles.loadingText, { color: colors.text }]}>Updating product...</Text>
        </View>
      ) : (
        <ScrollView style={addProductStyles.scrollView}>
          {/* Images Section */}
          <View style={addProductStyles.imagesSection}>
            <TouchableOpacity 
              style={[addProductStyles.addImageButton, { borderColor: colors.border }]}
              onPress={handleAddImage}
            >
              <Ionicons name="camera-outline" size={24} color={colors.secondaryText} />
              <Text style={[addProductStyles.addImageText, { color: colors.secondaryText }]}>
                {images.length > 0 ? 'Change photo' : 'Add photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Basic Info Section */}
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

          <SectionHeader title="Brand" required />
          <FormField 
            label="Search for brand"
            value={brand}
            onChangeText={setBrand}
          />

          <SectionHeader title="Comes with" />
          <View style={addProductStyles.comesWithContainer}>
            <View style={addProductStyles.comesWithInputContainer}>
              <TextInput
                style={[
                  addProductStyles.comesWithInput,
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
                style={[addProductStyles.addComesWithButton, { backgroundColor: colors.primary }]}
                onPress={handleAddComesWithItem}
              >
                <Text style={addProductStyles.addComesWithButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {comesWith.length > 0 && (
              <View style={addProductStyles.comesWithItemsContainer}>
                {comesWith.map((item, index) => (
                  <View key={index} style={[addProductStyles.comesWithItem, { backgroundColor: colors.card }]}>
                    <Text style={[addProductStyles.comesWithItemText, { color: colors.text }]}>{item}</Text>
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
              addProductStyles.notesInput,
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

          <View style={addProductStyles.bottomPadding} />
        </ScrollView>
      )}
    </View>
  );
};

export default EditProductScreen; 