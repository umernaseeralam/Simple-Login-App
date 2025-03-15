import { API_CONFIG } from '../config/api';

/**
 * API utility functions for making network requests
 */

interface Brand {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Fetch brands from the API
 * @param page Page number
 * @param perPage Number of items per page
 * @param sort Sort field
 * @param direction Sort direction
 * @param active Filter by active status
 * @returns Promise with brands data
 */
export const fetchBrands = async (
  page: number = 1,
  perPage: number = 200,
  sort: string = 'name',
  direction: string = 'asc',
  active: boolean = true
): Promise<Brand[]> => {
  try {
    // Check if API_CONFIG is properly initialized
    if (!API_CONFIG || !API_CONFIG.BASE_URL) {
      console.warn('API_CONFIG or BASE_URL is not properly set, using mock data');
      return mockBrands;
    }

    // Fix the template string check - this indicates the config hasn't been properly initialized
    if (API_CONFIG.BASE_URL.includes('{{ v1_url }}')) {
      console.warn('API_CONFIG contains template variables that were not replaced, using mock data');
      return mockBrands;
    }

    // Ensure proper URL construction
    const baseUrl = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL.slice(0, -1) : API_CONFIG.BASE_URL;
    const endpoint = API_CONFIG.ENDPOINTS.BRANDS.startsWith('/') ? API_CONFIG.ENDPOINTS.BRANDS : `/${API_CONFIG.ENDPOINTS.BRANDS}`;
    const url = `${baseUrl}${endpoint}?page=${page}&per_page=${perPage}&sort=${sort}&direction=${direction}&active=${active}`;
    
    console.log('Requesting URL:', url); // For debugging

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
      },
      // Add credentials if needed for cookies
      // credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Handle different API response formats
    if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else if (typeof result === 'object' && result !== null) {
      // Try to extract data from various common API response formats
      const possibleDataFields = ['brands', 'items', 'results', 'records'];
      for (const field of possibleDataFields) {
        if (result[field] && Array.isArray(result[field])) {
          return result[field];
        }
      }
    }
    
    console.warn('Unexpected API response format:', result);
    return [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    // Return mock data as fallback in case of error
    console.warn('Using mock data as fallback due to API error');
    return mockBrands;
  }
};

/**
 * Search brands by name
 * @param query Search query
 * @param brands List of brands to search in
 * @returns Filtered list of brands
 */
export const searchBrands = (query: string, brands: Brand[]): Brand[] => {
  if (!query || query.trim() === '') {
    return brands;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return brands.filter(brand => 
    brand.name.toLowerCase().includes(normalizedQuery)
  );
};

// Mock data for development and testing
const mockBrands: Brand[] = [
  { id: '1', name: 'Rolex' },
  { id: '2', name: 'Omega' },
  { id: '3', name: 'Patek Philippe' },
  { id: '4', name: 'Audemars Piguet' },
  { id: '5', name: 'Cartier' },
  { id: '6', name: 'IWC' },
  { id: '7', name: 'Jaeger-LeCoultre' },
  { id: '8', name: 'Panerai' },
  { id: '9', name: 'Breitling' },
  { id: '10', name: 'TAG Heuer' },
  { id: '11', name: 'Vacheron Constantin' },
  { id: '12', name: 'A. Lange & Söhne' },
  { id: '13', name: 'Hublot' },
  { id: '14', name: 'Zenith' },
  { id: '15', name: 'Tudor' },
];

export default {
  fetchBrands,
  searchBrands
};