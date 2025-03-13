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
    // For development/testing, return mock data if API_CONFIG.BASE_URL is not set
    if (!API_CONFIG.BASE_URL || API_CONFIG.BASE_URL === '{{ v1_url }}/web/brands?page=1&per_page=200&sort=name&direction=asc&active=true') {
      console.warn('Using mock data for brands as API_CONFIG.BASE_URL is not set');
      return mockBrands;
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BRANDS}?page=${page}&per_page=${perPage}&sort=${sort}&direction=${direction}&active=${active}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
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