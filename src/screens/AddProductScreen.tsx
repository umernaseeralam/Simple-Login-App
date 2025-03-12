import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";

// Component for section headers
export const SectionHeader: React.FC<{ title: string; required?: boolean }> = ({
  title,
  required = false,
}) => {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center px-4 py-2 bg-gray-100">
      <Text className="font-bold text-base">{title}</Text>
      {required && <Text className="text-red-500"> *Required</Text>}
    </View>
  );
};

// Component for form fields
export const FormField: React.FC<{
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
}> = ({
  label,
  value,
  onChangeText,
  placeholder = "Type Here",
  multiline = false,
  keyboardType = "default",
}) => {
  const { colors } = useTheme();
  return (
    <View className="px-4 py-3 border-b border-gray-200">
      {label && <Text className="mb-2 text-gray-500">{label}</Text>}
      <TextInput
        className={`border border-gray-500 rounded-md px-3 ${
          multiline ? "h-32 py-2" : "h-12"
        }`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
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
    <View className="flex-row flex-wrap p-4 border-b border-gray-200">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          className={`px-3 py-1.5 rounded-full border border-gray-500 mr-2 mb-2 ${
            selectedOption === option ? "bg-blue-500" : "bg-transparent"
          }`}
          onPress={() => onSelect(option)}
        >
          <Text
            className={
              selectedOption === option
                ? "text-white text-xs"
                : "text-gray-500 text-xs"
            }
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
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [comesWith, setComesWith] = useState<string[]>([]);
  const [comesWithText, setComesWithText] = useState("");
  const [condition, setCondition] = useState<string | null>(null);
  const [polish, setPolish] = useState<string | null>(null);
  const [crystal, setCrystal] = useState<string | null>(null);
  const [dial, setDial] = useState<string | null>(null);
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
  const dialOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const bezelOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const braceletOptions = ["New", "Seller", "Preowned", "Needs Service"];
  const movementOptions = ["New", "Seller", "Preowned", "Needs Service"];

  const handleAddImage = () => {
    // In a real app, this would open the image picker
    Alert.alert("Add Image", "This would open the image picker in a real app");
  };

  const handleAddComesWithItem = () => {
    if (comesWithText.trim()) {
      setComesWith([...comesWith, comesWithText.trim()]);
      setComesWithText("");
    }
  };

  const handleRemoveComesWithItem = (index: number) => {
    setComesWith(comesWith.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a product title");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Error", "Please enter a price");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to add a product");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the product object
      const newProduct = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim().startsWith("$") ? price.trim() : `$${price.trim()}`,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
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
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
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
        <ScrollView className="flex-1">
          {/* Images Section */}
          <View className="p-4 border-b border-gray-200">
            <TouchableOpacity
              className="h-24 border border-dashed border-gray-500 rounded-lg justify-center items-center"
              onPress={handleAddImage}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color={colors.secondaryText}
              />
              <Text className="mt-2 text-gray-500">Add more photos</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Info Section */}
          <SectionHeader title="Brand" required />
          <FormField
            placeholder="Search for brand"
            value={brand}
            onChangeText={setBrand}
          />

          <SectionHeader title="Title" required />
          <FormField
            placeholder="Product Title"
            value={title}
            onChangeText={setTitle}
          />

          <SectionHeader title="Description" />
          <FormField
            placeholder="Product Description..."
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />

          <SectionHeader title="Comes with" />
          <View className="px-4 py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 h-12 border border-gray-500 rounded-md px-3 mr-2"
                value={comesWithText}
                onChangeText={setComesWithText}
                placeholder="Add item"
                placeholderTextColor={colors.secondaryText}
              />
              <TouchableOpacity
                className="px-3 py-2 bg-blue-500 rounded"
                onPress={handleAddComesWithItem}
              >
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>

            {comesWith.length > 0 && (
              <View className="flex-row flex-wrap mt-3">
                {comesWith.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-center px-2 py-1 bg-gray-100 rounded-full mr-2 mb-2"
                  >
                    <Text className="mr-1">{item}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveComesWithItem(index)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={colors.secondaryText}
                      />
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
          <FormField label="Model" value={model} onChangeText={setModel} />
          <View className="flex-row flex-wrap">
            <View className="w-1/2">
              <FormField label="Ref" value={ref} onChangeText={setRef} />
            </View>
            <View className="w-1/2">
              <FormField
                label="Serial"
                value={serial}
                onChangeText={setSerial}
              />
            </View>
            <View className="w-1/2">
              <FormField label="Year" value={year} onChangeText={setYear} />
            </View>
            <View className="w-1/2">
              <FormField
                label="Time Score"
                value={timeScore}
                onChangeText={setTimeScore}
              />
            </View>
          </View>

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
            className="h-30 border border-gray-500 rounded-md p-3 m-4 text-base"
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="Type additional notes here"
            placeholderTextColor={colors.secondaryText}
            multiline
            textAlignVertical="top"
          />

          <View className="h-10" />
        </ScrollView>
      )}
    </View>
  );
};

// Keep the styles export for backward compatibility with EditProductScreen
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
