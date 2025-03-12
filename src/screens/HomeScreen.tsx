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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import ProductGridCard from "../components/ProductGridCard";
import ProductHorizontalCard from "../components/ProductHorizontalCard";
import ProductListCard from "../components/ProductListCard";
import { useProducts } from "../context/ProductsContext";
import { itemsData } from "../data/ProductsData";

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
  const { products } = useProducts();
  
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  // Calculate total pages
  const totalPages = Math.ceil(itemsData.length / itemsPerPage);

  // Get current items for pagination
  const getCurrentItems = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return itemsData.slice(0, endIndex);
  }, [currentPage, itemsPerPage]);

  const [currentItems, setCurrentItems] = useState(getCurrentItems());

  // Update current items when page changes
  useEffect(() => {
    setCurrentItems(getCurrentItems());
    setHasMoreItems(currentPage < totalPages);
  }, [currentPage, getCurrentItems, totalPages]);

  // Handle screen orientation and adjust layout
  useEffect(() => {
    const { width, height } = windowDimensions;
    const isLandscapeOrientation = width > height;
    setIsLandscape(isLandscapeOrientation);
    
    // Adjust number of columns based on orientation
    if (isLandscapeOrientation) {
      setNumColumns(3);
      setItemsPerPage(12);
    } else {
      setNumColumns(2);
      setItemsPerPage(8);
    }
    
    // Calculate horizontal item width - restore original calculation
    if (isLandscapeOrientation) {
      // Landscape mode
      if (width >= 1024) {
        setHorizontalItemWidth(width * 0.22);
      } else if (width >= 768) {
        setHorizontalItemWidth(width * 0.3);
      } else {
        setHorizontalItemWidth(width * 0.4);
      }
    } else {
      // Portrait mode
      if (width >= 768) {
        setHorizontalItemWidth(width * 0.4);
      } else {
        setHorizontalItemWidth(width * 0.6);
      }
    }
  }, [windowDimensions]);

  // Load more items when reaching the end of the list
  const loadMoreItems = useCallback(() => {
    if (currentPage < totalPages && !isLoading) {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        setCurrentPage(prevPage => prevPage + 1);
        setIsLoading(false);
      }, 1000);
    }
  }, [currentPage, totalPages, isLoading]);

  // Reset when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setCurrentPage(1);
    }, [])
  );

  // Toggle between grid and list view
  const toggleViewMode = () => {
    setViewMode(prevMode => (prevMode === "grid" ? "list" : "grid"));
  };

  // Navigate to user inventory
  const navigateToUserInventory = () => {
    navigation.navigate('UserInventory');
  };

  // Render item for grid view
  const renderGridItem = useCallback(({ item }: { item: any }) => (
    <ProductGridCard
      item={item}
      width={windowDimensions.width / numColumns - 16}
      colors={colors}
    />
  ), [numColumns, windowDimensions.width, colors]);

  // Render item for list view
  const renderListItem = useCallback(({ item }: { item: any }) => (
    <ProductListCard
      item={item}
      width={windowDimensions.width - 16}
      colors={colors}
    />
  ), [windowDimensions.width, colors]);

  // Render footer with loading indicator or "end of list" message
  const renderFooter = useCallback(() => {
    if (isLoading) {
      return (
        <View className="py-4 flex-row justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    
    if (!hasMoreItems) {
      return (
        <View className="py-4">
          <Text className="text-center text-gray-500">No More Products</Text>
        </View>
      );
    }
    
    return null;
  }, [isLoading, hasMoreItems, colors.primary]);

  // Render horizontal scrolling categories
  const renderHorizontalCategories = useCallback(() => (
    <View className="mb-6">
      {categories.map(category => (
        <View key={category.id} className="mb-4">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {category.title}
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
          >
            {category.data.map(item => (
              <ProductHorizontalCard
                key={item.id}
                item={item}
                width={horizontalItemWidth}
                height={isLandscape ? 100 : 120}
                isLandscape={isLandscape}
                colors={colors}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  ), [horizontalItemWidth, isLandscape, colors]);

  // Create a unique key for FlatList based on orientation and view mode
  const flatListKey = useMemo(() => 
    `${isLandscape ? 'landscape' : 'portrait'}-${viewMode}-${numColumns}`, 
    [isLandscape, viewMode, numColumns]
  );

  // Determine the number of columns based on view mode
  const effectiveNumColumns = viewMode === "grid" ? numColumns : 1;

  // Render the user inventory banner
  const renderUserInventoryBanner = useCallback(() => {
    if (products.length > 0) {
      return (
        <TouchableOpacity 
          className="mx-4 mb-4 p-4 rounded-lg flex-row justify-between items-center bg-blue-500"
          onPress={navigateToUserInventory}
        >
          <View>
            <Text className="text-white font-bold text-lg">Your Inventory</Text>
            <Text className="text-white opacity-80">{products.length} products</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      );
    }
    return null;
  }, [products.length, navigateToUserInventory]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Fixed Header */}
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200 bg-white dark:bg-gray-900 z-10">
        <TouchableOpacity onPress={toggleViewMode}>
          <Ionicons
            name={viewMode === "grid" ? "list" : "grid"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Products
        </Text>
        <TouchableOpacity onPress={navigateToUserInventory}>
          <Ionicons name="person" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1">
        {/* User inventory banner as part of the scrollable content */}
        {viewMode === "grid" ? (
          <FlatList
            key={`grid-${numColumns}`}
            data={currentItems}
            renderItem={renderGridItem}
            keyExtractor={item => item.id.toString()}
            numColumns={numColumns}
            contentContainerStyle={{ padding: 8 }}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <>
                {renderUserInventoryBanner()}
                {renderHorizontalCategories()}
              </>
            }
            ListFooterComponent={renderFooter}
          />
        ) : (
          <FlatList
            key="list"
            data={currentItems}
            renderItem={renderListItem}
            keyExtractor={item => item.id.toString()}
            numColumns={1}
            contentContainerStyle={{ padding: 8 }}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <>
                {renderUserInventoryBanner()}
                {renderHorizontalCategories()}
              </>
            }
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
