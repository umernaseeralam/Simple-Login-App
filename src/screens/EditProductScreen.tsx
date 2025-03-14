import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useProducts, Product } from '../context/ProductsContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import BrandsInput from '../components/BrandsInput';

// Import components from AddProductScreen
import { 
  SectionHeader, 
  FormField, 
} from './AddProductScreen';

import { OptionButtons, MultiSelectButtons } from "../components/MultipleOptionsComponent";

type EditProductRouteProp = RouteProp<{ EditProduct: { product: Product } }, 'EditProduct'>;

const EditProductScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditProductRouteProp>();
  const { product } = route.params;
  const { updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  
  // Form state
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price || '');
  const [brand, setBrand] = useState(product.brand || '');
  const [comesWith, setComesWith] = useState<string[]>(product.comesWith || []);
  const [condition, setCondition] = useState<string | null>(product.condition || null);
  const [polish, setPolish] = useState<string | null>(product.polish || null);
  const [crystal, setCrystal] = useState<string | null>(product.crystal || null);
  const [dial, setDial] = useState<string | null>(product.dial || null);
  const [dialColor, setDialColor] = useState<string | null>(product.dialColor || null);
  const [dialDetails, setDialDetails] = useState<string | null>(product.dialDetails || null);
  const [chrono, setChrono] = useState<string | null>(product.chrono || null);
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
  const conditionOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const polishOptions = ["Unpolished", "Needs Polish", "Preowned", "Needs Service"];
  const crystalOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const comesWithOptions = [
    "Watch Head",
    "Service Card/Papers",
    "Box Only",
    "Blank Papers",
    "Papers/Cards",
    "Box and Papers",
    "Archieves and Box",
  ];
  const dialOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const dialColorOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const dialDetailsOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const chronoOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const bezelOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const braceletOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const movementOptions = ["New", "Seller", "Preowned", "Needs Service"];

  // Validation functions
  const validateTitle = (text: string) => {
    return text.trim() === "" ? "Title is required" : null;
  };

  const validatePrice = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    return numericValue === "" ? "Price is required" : null;
  };

  const validateYear = (text: string) => {
    if (text === "") return null;
    const yearNum = parseInt(text, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1700 || yearNum > currentYear) {
      return `Year must be between 1700 and ${currentYear}`;
    }
    return null;
  };

  const validateBrand = (text: string) => {
    return text.trim() === "" ? "Brand is required" : null;
  };

  const handleAddImage = () => {
    Alert.alert("Add Image", "This would open the image picker in a real app");
  };

  const handleToggleComesWithOption = (option: string) => {
    const updatedOptions = comesWith.includes(option)
      ? comesWith.filter((item) => item !== option)
      : [...comesWith, option];

    setComesWith(updatedOptions);
    setErrors({
      ...errors,
      comesWith:
        updatedOptions.length === 0
          ? "Please select at least one option"
          : null,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {
      title: validateTitle(title),
      price: validatePrice(price),
      brand: validateBrand(brand),
      year: validateYear(year),
      comesWith:
        comesWith.length === 0 ? "Please select at least one option" : null,
    };

    setErrors(newErrors);

    // Return true if no errors (all values are null)
    return Object.values(newErrors).every((error) => error === null);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      Alert.alert("Error", "Please fill all the required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure price has $ sign
      const formattedPrice = price.trim().startsWith("$")
        ? price.trim()
        : `$${price.trim()}`;

      // Create the updated product object
      const updatedProduct: Product = {
        ...product,
        title: title.trim(),
        description: description.trim(),
        price: formattedPrice,
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
        dialColor: dialColor || undefined,
        dialDetails: dialDetails || undefined,
        chrono: chrono || undefined,
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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Edit Listing</Text>
          <TouchableOpacity
            className={`px-3 py-1.5 ${
              isSubmitting ? "opacity-70" : "opacity-100"
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-green-500 font-bold">Update</Text>
          </TouchableOpacity>
        </View>

        {isSubmitting ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-4 text-base">Updating product...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
            <View className="p-3 border-b border-gray-200">
              <TouchableOpacity
                className="h-20 border border-dashed border-gray-500 rounded-lg justify-center items-center"
                onPress={handleAddImage}
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.secondaryText}
                />
                <Text className="mt-1 text-gray-500">
                  {images.length > 0 ? 'Change photos' : 'Add photos'}
                </Text>
              </TouchableOpacity>
            </View>

            <SectionHeader title="Required" required />
            <BrandsInput
              label="Brand Name"
              value={brand}
              onChangeText={(text) => {
                setBrand(text);
                setErrors({ ...errors, brand: validateBrand(text) });
              }}
              placeholder="Search for brand"
            />
            {errors.brand && (
              <Text className="text-red-500 text-xs px-4">{errors.brand}</Text>
            )}

            <MultiSelectButtons
              label="Comes with:"
              options={comesWithOptions}
              selectedOptions={comesWith}
              onToggleOption={handleToggleComesWithOption}
              required={true}
              error={errors.comesWith}
            />

            <SectionHeader title="Pricing" required />
            <FormField
              label="Asking Price"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                setErrors({ ...errors, price: validatePrice(text) });
              }}
              placeholder="$0"
              keyboardType="numeric"
              isPriceField={true}
              validation={validatePrice}
            />

            <SectionHeader title="Product Name" required />
            <FormField
              placeholder="Product Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors({ ...errors, title: validateTitle(text) });
              }}
              validation={validateTitle}
            />

            <SectionHeader title="Description" />
            <FormField
              placeholder="Product Description..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
              maxLength={500}
              showCharCount={true}
            />

            <SectionHeader title="Watch Info" />

            <View className="flex-row flex-wrap">
              <View className="w-1/2">
                <FormField
                  label="Reference No"
                  value={ref}
                  onChangeText={setRef}
                />
              </View>
              <View className="w-1/2">
                <FormField
                  label="Serial No"
                  value={serial}
                  onChangeText={setSerial}
                />
              </View>
              <View className="w-1/2">
                <FormField
                  label="Year"
                  value={year}
                  onChangeText={(text) => {
                    setYear(text);
                    setErrors({ ...errors, year: validateYear(text) });
                  }}
                  keyboardType="numeric"
                  validation={validateYear}
                />
              </View>
              <View className="w-1/2">
                <FormField
                  label="Model"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>
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

            <SectionHeader title="Chrono" />
            <OptionButtons
              options={chronoOptions}
              selectedOption={chrono}
              onSelect={setChrono}
            />

            <SectionHeader title="Movement" />
            <OptionButtons
              options={movementOptions}
              selectedOption={movement}
              onSelect={setMovement}
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
            <SectionHeader title="Dial Color" />
            <OptionButtons
              options={dialColorOptions}
              selectedOption={dialColor}
              onSelect={setDialColor}
            />
            <SectionHeader title="Dial Details" />
            <OptionButtons
              options={dialDetailsOptions}
              selectedOption={dialDetails}
              onSelect={setDialDetails}
            />

            <SectionHeader title="Bezel" />
            <OptionButtons
              options={bezelOptions}
              selectedOption={bezel}
              onSelect={setBezel}
            />

            <SectionHeader title="Bracelet" />
            <OptionButtons
              options={braceletOptions}
              selectedOption={bracelet}
              onSelect={setBracelet}
            />

            <SectionHeader title="Additional Notes" />
            <View className="px-4 py-2">
              <TextInput
                className="h-24 border border-gray-300 rounded-md p-3 text-base"
                value={additionalNotes}
                onChangeText={setAdditionalNotes}
                placeholder="Type additional notes here"
                placeholderTextColor={colors.secondaryText}
                multiline
                textAlignVertical="top"
                editable={true}
                autoCorrect={false}
                maxLength={500}
              />
              <Text className="text-xs text-gray-400 mt-1 text-right">
                {additionalNotes.length}/500
              </Text>
            </View>

            <View className="h-8" />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default EditProductScreen;