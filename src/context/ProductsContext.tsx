import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the extended Item type with additional fields from the image
export interface Product {
  id: number;
  title: string;
  description: string;
  color: string;
  price: string;
  ownerId: string;
  brand?: string;
  comesWith?: string[];
  watchInfo?: {
    model?: string;
    ref?: string;
    serial?: string;
    year?: string;
    timeScore?: string;
  };
  condition?: string;
  polish?: string;
  crystal?: string;
  dial?: string;
  dialColor?: string;
  dialDetails?: string;
  chrono?: string;
  bezel?: string;
  movement?: string;
  bracelet?: string;
  additionalNotes?: string;
  images?: string[];
  purchaseDate?: string;
}

interface ProductsContextType {
  products: Product[];
  defaultProducts: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getNextId: () => number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Default products data from HomeScreen
const defaultProductsData: Product[] = [
  {
    id: 1,
    title: "Wireless Earbuds",
    description: "Bluetooth 5.0 with noise cancellation",
    color: "#3498db",
    price: "$49.99",
    ownerId: "",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Fitness tracker with heart rate monitor",
    color: "#2ecc71",
    price: "$89.99",
    ownerId: "",
  },
  // Add more default products as needed
];

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  // Load products from AsyncStorage on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem('userProducts');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }

        const storedNextId = await AsyncStorage.getItem('nextProductId');
        if (storedNextId) {
          setNextId(parseInt(storedNextId, 10));
        } else {
          // Initialize with the highest ID from default products + 1
          const maxDefaultId = defaultProductsData.reduce(
            (max, product) => Math.max(max, product.id), 0
          );
          setNextId(maxDefaultId + 1);
        }
      } catch (error) {
        console.error('Error loading products from storage:', error);
      }
    };

    loadProducts();
  }, []);

  // Save products to AsyncStorage whenever they change
  useEffect(() => {
    const saveProducts = async () => {
      try {
        await AsyncStorage.setItem('userProducts', JSON.stringify(products));
      } catch (error) {
        console.error('Error saving products to storage:', error);
      }
    };

    if (products.length > 0) {
      saveProducts();
    }
  }, [products]);

  // Save nextId to AsyncStorage whenever it changes
  useEffect(() => {
    const saveNextId = async () => {
      try {
        await AsyncStorage.setItem('nextProductId', nextId.toString());
      } catch (error) {
        console.error('Error saving nextId to storage:', error);
      }
    };

    saveNextId();
  }, [nextId]);

  const getNextId = () => {
    return nextId;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: nextId,
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    setNextId(prevId => prevId + 1);
  };

  const updateProduct = async (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = async (id: number) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        defaultProducts: defaultProductsData,
        addProduct,
        updateProduct,
        deleteProduct,
        getNextId,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}; 