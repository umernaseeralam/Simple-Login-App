import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import ProductGridCard, { Item } from "../components/ProductGridCard";
import ProductHorizontalCard from "../components/ProductHorizontalCard";
import ProductListCard from "../components/ProductListCard";
// Local array database with 30 items with realistic product names
const itemsData: Item[] = [
  {
    id: 1,
    title: "Wireless Earbuds",
    description: "Bluetooth 5.0 with noise cancellation",
    color: "#3498db",
    price: "$49.99",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Fitness tracker with heart rate monitor",
    color: "#2ecc71",
    price: "$89.99",
  },
  {
    id: 3,
    title: "Portable Charger",
    description: "10000mAh power bank for all devices",
    color: "#e74c3c",
    price: "$29.99",
  },
  {
    id: 4,
    title: "Laptop Sleeve",
    description: 'Waterproof protective case for 15" laptops',
    color: "#f39c12",
    price: "$19.99",
  },
  {
    id: 5,
    title: "Bluetooth Speaker",
    description: "Waterproof with 12-hour battery life",
    color: "#9b59b6",
    price: "$39.99",
  },
  {
    id: 6,
    title: "Phone Stand",
    description: "Adjustable desk holder for smartphones",
    color: "#1abc9c",
    price: "$12.99",
  },
  {
    id: 7,
    title: "Wireless Mouse",
    description: "Ergonomic design with silent clicks",
    color: "#d35400",
    price: "$24.99",
  },
  {
    id: 8,
    title: "Keyboard Cover",
    description: "Silicone protector for MacBook keyboards",
    color: "#34495e",
    price: "$14.99",
  },
  {
    id: 9,
    title: "USB-C Hub",
    description: "7-in-1 adapter with HDMI and card readers",
    color: "#16a085",
    price: "$35.99",
  },
  {
    id: 10,
    title: "Desk Lamp",
    description: "LED with adjustable brightness and color",
    color: "#27ae60",
    price: "$32.99",
  },
  {
    id: 11,
    title: "Webcam Cover",
    description: "Privacy slider for laptop cameras",
    color: "#c0392b",
    price: "$7.99",
  },
  {
    id: 12,
    title: "Cable Organizer",
    description: "Silicone clips for desk cable management",
    color: "#f1c40f",
    price: "$9.99",
  },
  {
    id: 13,
    title: "Wireless Charger",
    description: "Fast charging pad for Qi-enabled devices",
    color: "#8e44ad",
    price: "$22.99",
  },
  {
    id: 14,
    title: "Screen Cleaner",
    description: "Microfiber cloth with cleaning spray",
    color: "#2980b9",
    price: "$11.99",
  },
  {
    id: 15,
    title: "Phone Grip",
    description: "Expandable stand and grip for smartphones",
    color: "#e67e22",
    price: "$8.99",
  },
  {
    id: 16,
    title: "Tablet Stand",
    description: "Adjustable angle holder for iPads and tablets",
    color: "#7f8c8d",
    price: "$18.99",
  },
  {
    id: 17,
    title: "Noise-Cancelling Headphones",
    description: "Over-ear design with 20hr battery life",
    color: "#2c3e50",
    price: "$129.99",
  },
  {
    id: 18,
    title: "Mechanical Keyboard",
    description: "RGB backlit with tactile switches",
    color: "#3498db",
    price: "$79.99",
  },
  {
    id: 19,
    title: "Laptop Cooling Pad",
    description: "Dual fan design with height adjustment",
    color: "#2ecc71",
    price: "$25.99",
  },
  {
    id: 20,
    title: "Smartphone Gimbal",
    description: "3-axis stabilizer for smooth video recording",
    color: "#e74c3c",
    price: "$69.99",
  },
  {
    id: 21,
    title: "Desk Organizer",
    description: "Multi-compartment storage for office supplies",
    color: "#f39c12",
    price: "$15.99",
  },
  {
    id: 22,
    title: "Wireless Keyboard",
    description: "Slim design with multi-device connectivity",
    color: "#9b59b6",
    price: "$45.99",
  },
  {
    id: 23,
    title: "Monitor Stand",
    description: "Height adjustable with cable management",
    color: "#1abc9c",
    price: "$32.99",
  },
  {
    id: 24,
    title: "Touchscreen Gloves",
    description: "Winter gloves compatible with smartphones",
    color: "#d35400",
    price: "$14.99",
  },
  {
    id: 25,
    title: "Laptop Privacy Screen",
    description: 'Anti-spy filter for 15.6" displays',
    color: "#34495e",
    price: "$29.99",
  },
  {
    id: 26,
    title: "Smart Bulb",
    description: "WiFi-enabled RGB light with app control",
    color: "#16a085",
    price: "$19.99",
  },
  {
    id: 27,
    title: "Wireless Presenter",
    description: "Laser pointer with slide controls",
    color: "#27ae60",
    price: "$24.99",
  },
  {
    id: 28,
    title: "Desk Mat",
    description: "Large mousepad with microfiber surface",
    color: "#c0392b",
    price: "$17.99",
  },
  {
    id: 29,
    title: "Phone Sanitizer",
    description: "UV light cleaner for smartphones",
    color: "#f1c40f",
    price: "$39.99",
  },
  {
    id: 30,
    title: "Webcam Light",
    description: "Ring light for video calls and streaming",
    color: "#8e44ad",
    price: "$28.99",
  },
];

// Create categories for horizontal layout
const categories = [
  { id: 1, title: "Popular Items", data: itemsData.slice(0, 10) },
  { id: 2, title: "New Arrivals", data: itemsData.slice(10, 20) },
  { id: 3, title: "On Sale", data: itemsData.slice(20, 30) },
];

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const windowDimensions = useWindowDimensions();
  const [horizontalItemWidth, setHorizontalItemWidth] = useState(0);
  const [numColumns, setNumColumns] = useState(2);
  const [isLandscape, setIsLandscape] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate paginated items
  const paginatedItems = useMemo(() => {
    return itemsData.slice(0, currentPage * itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Check if there are more items to load
  const hasMoreItems = useMemo(() => {
    return paginatedItems.length < itemsData.length;
  }, [paginatedItems.length]);

  // Load more items function
  const loadMoreItems = useCallback(() => {
    if (hasMoreItems && !isLoading) {
      setIsLoading(true);
      // Simulate network delay
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  }, [hasMoreItems, isLoading]);

  // Handle end reached for infinite scrolling
  const handleEndReached = useCallback(() => {
    if (hasMoreItems && !isLoading) {
      loadMoreItems();
    }
  }, [hasMoreItems, isLoading, loadMoreItems]);

  // Update layout based on screen dimensions
  useEffect(() => {
    const width = windowDimensions.width;
    const height = windowDimensions.height;
    const isLandscapeMode = width > height;
    setIsLandscape(isLandscapeMode);

    if (isLandscapeMode) {
      // Landscape mode
      if (width >= 1024) {
        setNumColumns(4);
        setHorizontalItemWidth(width * 0.22);
      } else if (width >= 768) {
        setNumColumns(3);
        setHorizontalItemWidth(width * 0.3);
      } else {
        setNumColumns(2);
        setHorizontalItemWidth(width * 0.4);
      }
    } else {
      // Portrait mode
      if (width >= 768) {
        setNumColumns(2);
        setHorizontalItemWidth(width * 0.4);
      } else {
        setNumColumns(2);
        setHorizontalItemWidth(width * 0.6);
      }
    }
  }, [windowDimensions.width, windowDimensions.height]);

  const renderGridItem = useCallback(
    ({ item }: { item: Item }) => {
      const itemWidth =
        (windowDimensions.width - (numColumns + 1) * 10) / numColumns;

      if (viewMode === "list") {
        return (
          <ProductListCard
            item={item}
            width={windowDimensions.width}
            colors={colors}
          />
        );
      }

      return <ProductGridCard item={item} width={itemWidth} colors={colors} />;
    },
    [windowDimensions.width, numColumns, colors, viewMode]
  );

  const renderHorizontalItem = useCallback(
    ({ item }: { item: Item }) => {
      const isSmallPhonePortrait = !isLandscape && windowDimensions.width < 768;
      const itemHeight = isLandscape ? 100 : isSmallPhonePortrait ? 90 : 120;

      return (
        <ProductHorizontalCard
          item={item}
          width={horizontalItemWidth}
          height={itemHeight}
          isLandscape={isLandscape}
          isSmallPhonePortrait={isSmallPhonePortrait}
          colors={colors}
        />
      );
    },
    [isLandscape, windowDimensions.width, horizontalItemWidth, colors]
  );

  const renderCategorySection = useCallback(
    (category: { id: number; title: string; data: Item[] }) => {
      const isSmallPhonePortrait = !isLandscape && windowDimensions.width < 768;

      return (
        <View
          className={`
          ${
            isLandscape
              ? windowDimensions.width >= 1024
                ? "w-1/3"
                : "w-1/2"
              : ""
          }
          ${isSmallPhonePortrait ? "my-2.5 px-2.5" : "my-4 px-4"}
        `}
          style={isLandscape ? { paddingRight: 5 } : {}}
        >
          <Text
            className={`font-bold ${
              isSmallPhonePortrait ? "text-base mb-2" : "text-lg mb-2.5"
            }`}
            style={{ color: colors.text }}
          >
            {category.title}
          </Text>
          <FlatList
            horizontal
            data={category.data}
            renderItem={renderHorizontalItem}
            keyExtractor={(item) => `horizontal-${category.id}-${item.id}`}
            showsHorizontalScrollIndicator={false}
            className={`${isSmallPhonePortrait ? "pr-2.5" : "pr-4"}`}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: horizontalItemWidth,
              offset: horizontalItemWidth * index,
              index,
            })}
          />
        </View>
      );
    },
    [
      isLandscape,
      windowDimensions.width,
      colors,
      renderHorizontalItem,
      horizontalItemWidth,
    ]
  );

  // Create sections for the main FlatList
  type Section = {
    id: string;
    type: "header" | "categories" | "allProducts";
  };

  const sections: Section[] = [
    { id: "header", type: "header" },
    { id: "categories", type: "categories" },
    { id: "allProducts", type: "allProducts" },
  ];

  const renderMainListItem = useCallback(
    ({ item }: { item: Section }) => {
      switch (item.type) {
        case "header":
          return (
            <View
              className="p-4 border-b bg-slate-900"
              style={{
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  Featured Products
                </Text>
                
              </View>
              <Text className="text-sm" style={{ color: colors.secondaryText }}>
                Browse our collection of tech accessories
              </Text>
            </View>
          );
        case "categories":
          return (
            <View className={isLandscape ? "flex-col" : "px-0 pb-2.5"}>
              {isLandscape ? (
                <View className="flex-row flex-wrap p-2.5">
                  {categories.map((category) => (
                    <React.Fragment key={`category-section-${category.id}`}>
                      {renderCategorySection(category)}
                    </React.Fragment>
                  ))}
                </View>
              ) : (
                <View className="px-2.5">
                  {categories.map((category) => (
                    <React.Fragment key={`category-section-${category.id}`}>
                      {renderCategorySection(category)}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          );
        case "allProducts":
          return (
            <>
              <View className="flex-row justify-between items-center px-1.5 my-2.5">
                <Text
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  All Products
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
                  }
                  className="px-3 py-1.5 rounded-full flex-row items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Ionicons
                    name={viewMode === "grid" ? "list" : "grid"}
                    size={16}
                    color="white"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-white font-medium">
                    {viewMode === "grid" ? "List View" : "Grid View"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="p-1.5">
                <FlatList
                  data={paginatedItems}
                  renderItem={renderGridItem}
                  keyExtractor={(item) => `product-${item.id}`}
                  numColumns={viewMode === "grid" ? numColumns : 1}
                  key={`${viewMode}-${numColumns}`}
                  scrollEnabled={false}
                  initialNumToRender={8}
                  maxToRenderPerBatch={4}
                  windowSize={5}
                  getItemLayout={(data, index) => {
                    if (viewMode === "list") {
                      return {
                        length: 70 + 20, // imageSize + padding
                        offset: (70 + 20) * index,
                        index,
                      };
                    }
                    return {
                      length: windowDimensions.width / numColumns,
                      offset:
                        (windowDimensions.width / numColumns) *
                        Math.floor(index / numColumns),
                      index,
                    };
                  }}
                />
                {hasMoreItems && (
                  <TouchableOpacity
                    onPress={loadMoreItems}
                    disabled={isLoading}
                    className="mt-4 mb-6 py-3 rounded-lg flex-row justify-center items-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-white font-medium">Load More</Text>
                    )}
                  </TouchableOpacity>
                )}
                {!hasMoreItems && (
                  <View className="py-6 items-center">
                    <Text style={{ color: colors.secondaryText }}>
                      No more products to load
                    </Text>
                  </View>
                )}
              </View>
            </>
          );
        default:
          return null;
      }
    },
    [
      colors,
      isLandscape,
      renderCategorySection,
      renderGridItem,
      numColumns,
      windowDimensions.width,
      viewMode,
      paginatedItems,
      hasMoreItems,
      isLoading,
      loadMoreItems,
    ]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>

      <FlatList
        data={sections}
        renderItem={renderMainListItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-grow"
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
    </View>
  );
};

export default React.memo(HomeScreen);
