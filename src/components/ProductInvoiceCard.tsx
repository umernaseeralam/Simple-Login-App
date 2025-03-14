import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

export interface Item {
  id: number;
  title: string;
  description: string;
  color: string;
  price: string;
  purchaseDate: string;
  ownerId: string;
  invoiceStatus: string; // Add invoiceStatus here
}

interface ProductInvoiceCardProps {
  item: Item;
  width: number;
  colors: {
    card: string;
    text: string;
    border: string;
    secondaryText: string;
    primary: string;
  };
}

const ProductInvoiceCard: React.FC<ProductInvoiceCardProps> = memo(
  ({ item, width, colors }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const cardHeight = width * 1.2; // Maintain aspect ratio

    // Determine badge color based on invoiceStatus
    const badgeColor = item.invoiceStatus === "Cleared" ? "#27ae60" : "#f97316";

    return (
      <TouchableOpacity
        className="m-1.5 rounded-lg border overflow-hidden bg-white dark:bg-gray-800 relative"
        style={{
          width,
          height: cardHeight,
          borderColor: colors.border,
        }}
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
      >
        <View
          className="justify-center items-center"
          style={{
            backgroundColor: item.color,
            height: cardHeight * 0.6,
          }}
        >
          <Text className="text-5xl text-white font-bold">
            {item.title.charAt(0)}
          </Text>
        </View>
        <View className="p-2.5 flex-1 justify-between">
          <Text
            className="text-base font-bold mb-1 text-gray-800 dark:text-gray-200"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-sm mb-1 text-gray-500" numberOfLines={1}>
            {item.description}
          </Text>
          <Text className="text-base font-bold text-blue-500">
            {item.price}
          </Text>
        </View>
        <View
          style={[
            styles.dateBadge,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.dateText, { color: colors.secondaryText }]}>
            Purchased: {item.purchaseDate}
          </Text>
        </View>
        {/* Invoice Status Badge */}
        <View
          style={[styles.statusBadge, { backgroundColor: badgeColor }]}
        >
          <Text style={styles.statusText}>{item.invoiceStatus}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  dateBadge: {
    position: "absolute",
    bottom: 4,
    left: 8,
    right: 8,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductInvoiceCard;