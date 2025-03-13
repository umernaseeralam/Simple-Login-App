import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import BrandsInput from "../components/BrandsInput";
import { OptionButtons, MultiSelectButtons } from "../components/MultipleOptionsComponent";

export const SectionHeader: React.FC<{ title: string; required?: boolean }> = ({
  title,
  required = false,
}) => {
  return (
    <View className="flex-row items-center px-4 py-2 bg-gray-100">
      <Text className="font-bold text-base">{title}</Text>
      {required && <Text className="text-red-500"> *</Text>}
    </View>
  );
};

export const FormField: React.FC<{
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
  maxLength?: number;
  showCharCount?: boolean;
  isPriceField?: boolean;
  validation?: (text: string) => string | null;
  autoCapitalize?: boolean;
}> = ({
  label,
  value,
  onChangeText,
  placeholder = "Type Here",
  multiline = false,
  keyboardType = "default",
  maxLength,
  showCharCount = false,
  isPriceField = false,
  validation,
  autoCapitalize = false,
}) => {
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);

  const handleChangeText = (text: string) => {
    // Handle price field formatting
    if (isPriceField) {
      // Remove any non-numeric characters except dots
      let numericValue = text.replace(/[^0-9.]/g, "");

      // Ensure only one decimal point
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Add $ sign if it's not already there
      if (!numericValue.startsWith("$") && numericValue) {
        numericValue = "$" + numericValue;
      }

      onChangeText(numericValue);
    } else if (autoCapitalize) {
      // Auto capitalize input
      onChangeText(text.toUpperCase());
    } else {
      onChangeText(text);
    }

    // Validate field if validation function is provided
    if (validation) {
      setError(validation(text));
    }
  };

  return (
    <View className="px-4 py-2">
      {label && <Text className="mb-1 text-gray-500">{label}</Text>}
      <TextInput
        className={`border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 ${multiline ? "h-28 py-2" : "h-11"}`}
        value={value}
        onChangeText={handleChangeText}
        placeholder={isPriceField && !value ? "$0" : placeholder}
        placeholderTextColor={colors.secondaryText}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
        editable={true}
        autoCorrect={false}
        maxLength={maxLength}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      {showCharCount && maxLength && (
        <Text className="text-xs text-gray-400 mt-1 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const AddProductScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { addProduct } = useProducts();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [comesWith, setComesWith] = useState<string[]>([]);
  const [condition, setCondition] = useState<string | null>(null);
  const [polish, setPolish] = useState<string | null>(null);
  const [crystal, setCrystal] = useState<string | null>(null);
  const [dial, setDial] = useState<string | null>(null);
  const [dialColor, setDialColor] = useState<string | null>(null);
  const [dialDetails, setDialDetails] = useState<string | null>(null);
  const [chrono, setChrono] = useState<string | null>(null);
  const [bezel, setBezel] = useState<string | null>(null);
  const [bracelet, setBracelet] = useState<string | null>(null);
  const [movement, setMovement] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Watch info
  const [model, setModel] = useState("");
  const [ref, setRef] = useState("");
  const [serial, setSerial] = useState("");
  const [year, setYear] = useState("");
  const [timeScore, setTimeScore] = useState("");

  // Images
  const [images, setImages] = useState<string[]>([]);

  // Options for condition and other fields
  const conditionOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const polishOptions = [
    "Unpolished",
    "Needs Polish",
    "Preowned",
    "Needs Service",
  ];
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

    if (!user) {
      Alert.alert("Error", "You must be logged in to add a product");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure price has $ sign
      const formattedPrice = price.trim().startsWith("$")
        ? price.trim()
        : `$${price.trim()}`;

      const newProduct = {
        title: title.trim(),
        description: description.trim(),
        price: formattedPrice,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        ownerId: user.id,
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

      await addProduct(newProduct);
      Alert.alert("Success", "Product added successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product");
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
          <Text className="text-lg font-bold">New Listing</Text>
          <TouchableOpacity
            className={`px-3 py-1.5 ${
              isSubmitting ? "opacity-70" : "opacity-100"
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-green-500 font-bold">Submit</Text>
          </TouchableOpacity>
        </View>

        {isSubmitting ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-4 text-base">Adding product...</Text>
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
                <Text className="mt-1 text-gray-500">Add photos</Text>
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
                  autoCapitalize={true}
                />
              </View>
              <View className="w-1/2">
                <FormField
                  label="Serial No"
                  value={serial}
                  onChangeText={setSerial}
                  autoCapitalize={true}
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

export const styles = {
  container: "flex-1 bg-white",
  header:
    "flex-row justify-between items-center px-4 py-3 border-b border-gray-200",
  headerTitle: "text-lg font-bold",
  submitButton: "px-3 py-1.5",
  submitButtonText: "text-green-500 font-bold",
  scrollView: "flex-1",
  loadingContainer: "flex-1 justify-center items-center",
  loadingText: "mt-4 text-base",
  imagesSection: "p-4 border-b border-gray-200",
  addImageButton:
    "h-24 border border-dashed border-gray-500 rounded-lg justify-center items-center",
  addImageText: "mt-2 text-gray-500",
  sectionHeader: "flex-row items-center px-4 py-2 bg-gray-100",
  sectionHeaderText: "font-bold text-base",
  fieldContainer: "px-4 py-3 border-b border-gray-200",
  fieldLabel: "mb-2 text-gray-500",
  input: "border border-gray-500 rounded-md px-3",
  comesWithContainer: "px-4 py-3 border-b border-gray-200",
  comesWithInputContainer: "flex-row items-center",
  comesWithInput: "flex-1 h-10 border border-gray-500 rounded-md px-3 mr-2",
  addComesWithButton: "px-3 py-2 bg-blue-500 rounded",
  addComesWithButtonText: "text-white font-bold",
  comesWithItemsContainer: "flex-row flex-wrap mt-3",
  comesWithItem:
    "flex-row items-center px-2 py-1 bg-gray-100 rounded-full mr-2 mb-2",
  comesWithItemText: "mr-1",
  optionsContainer: "flex-row flex-wrap p-4 border-b border-gray-200",
  optionButton: "px-3 py-1.5 rounded-full border border-gray-500 mr-2 mb-2",
  optionText: "text-xs",
  notesInput: "h-30 border border-gray-500 rounded-md p-3 m-4 text-base",
  bottomPadding: "h-10",
};

export default AddProductScreen;