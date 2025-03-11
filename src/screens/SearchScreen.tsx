import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductGridCard, { Item } from '../components/ProductGridCard';

// Define search params type
type SearchParams = {
  products: Item[];
};

type SearchScreenRouteProp = RouteProp<{ Search: SearchParams }, 'Search'>;

const SearchScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchScreenRouteProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const windowWidth = Dimensions.get('window').width;
  
  // Get products from route params or use empty array
  const allProducts = route.params?.products || [];

  // Handle search submission
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Add to search history (avoid duplicates and keep most recent at top)
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 10); // Keep only 10 most recent searches
    });
    
    // Simulate API search with timeout
    setTimeout(() => {
      const results = allProducts.filter((item: Item) => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  // Generate suggestions based on current input
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts
        .filter((item: Item) => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item: Item) => item.title)
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  // Clear history
  const clearHistory = () => {
    setSearchHistory([]);
  };

  // Calculate item width for grid
  const itemWidth = (windowWidth - 32) / 2 - 3;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.searchHeader, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchInputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content Area */}
      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSearchQuery(suggestion);
                  handleSearch(suggestion);
                }}
              >
                <Ionicons name="search-outline" size={16} color={colors.secondaryText} style={styles.suggestionIcon} />
                <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search History (show only if no active search and no query) */}
        {searchQuery.length === 0 && searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Searches</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={[styles.clearHistoryText, { color: colors.primary }]}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            {searchHistory.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.historyItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSearchQuery(item);
                  handleSearch(item);
                }}
              >
                <Ionicons name="time-outline" size={16} color={colors.secondaryText} style={styles.historyIcon} />
                <Text style={[styles.historyText, { color: colors.text }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Results */}
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Searching...</Text>
          </View>
        ) : (
          searchResults.length > 0 && searchQuery.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultsTitle, { color: colors.text }]}>
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </Text>
              
              <View style={styles.resultsGrid}>
                {searchResults.map((item) => (
                  <ProductGridCard 
                    key={item.id} 
                    item={item} 
                    width={itemWidth}
                    colors={colors}
                  />
                ))}
              </View>
            </View>
          )
        )}

        {/* No Results */}
        {!isSearching && searchResults.length === 0 && searchQuery.length > 0 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={64} color={colors.secondaryText} />
            <Text style={[styles.noResultsText, { color: colors.text }]}>No results found</Text>
            <Text style={[styles.noResultsSubtext, { color: colors.secondaryText }]}>
              Try different keywords or check spelling
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
  },
  historyContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearHistoryText: {
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    fontSize: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SearchScreen; 