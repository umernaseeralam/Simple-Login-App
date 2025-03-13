import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

// OptionButtons Component
export const OptionButtons: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
}> = ({ options, selectedOption, onSelect }) => {
  return (
    <View className="flex-row flex-wrap p-2">
      {options.map((option, index) => (
        <TouchableOpacity
          key={`option-${index}-${option}`}
          className={`px-3 py-1.5 rounded-md border border-gray-200 mr-2 mb-1 ${
            selectedOption === option ? "bg-emerald-500" : "bg-transparent"
          }`}
          onPress={() => onSelect(option)}
        >
          <Text
            className={
              selectedOption === option
                ? "text-white text-xs"
                : "text-emerald-600 text-xs"
            }
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// MultiSelectButtons Component
export const MultiSelectButtons: React.FC<{
  label?: string;
  options: string[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  required?: boolean;
  error?: string | null;
}> = ({
  label,
  options,
  selectedOptions,
  onToggleOption,
  required = false,
  error,
}) => {
  return (
    <View className="px-2 py-2 border-b border-gray-200">
      {label && (
        <View className="flex-row items-center px-2 mb-2">
          <Text className="font-normal text-gray-500 text-md">{label}</Text>
          {required && <Text className="text-red-500"> *</Text>}
        </View>
      )}
      <View className="flex-row flex-wrap">
        {options.map((option, index) => (
          <TouchableOpacity
            key={`multi-option-${index}-${option}`}
            className={`px-3 py-1.5 rounded-md border border-gray-200 mr-2 mb-2 ${
              selectedOptions.includes(option)
                ? "bg-emerald-500"
                : "bg-transparent"
            }`}
            onPress={() => onToggleOption(option)}
          >
            <Text
              className={
                selectedOptions.includes(option)
                  ? "text-white text-xs"
                  : "text-emerald-600 text-xs"
              }
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text className="text-red-500 text-xs ml-2">{error}</Text>}
    </View>
  );
};