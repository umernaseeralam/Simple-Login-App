import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (validateEmail(email)) {
      setIsLoading(true);
      try {
        // In a real app, you would make an API call to send reset password email
        // For this example, we'll simulate a successful request
        await new Promise(resolve => setTimeout(resolve, 1000));
        Alert.alert(
          'Reset Password',
          'If an account exists with this email, you will receive password reset instructions.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 px-5 py-8">
        <TouchableOpacity 
          className="mb-4 flex-row items-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
          <Text className="ml-2 text-gray-800 dark:text-white text-base">Back to Login</Text>
        </TouchableOpacity>

        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-primary dark:text-white">Reset Password</Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <Text className="text-base text-gray-600 dark:text-gray-300 mb-6 text-center">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <View className="mb-4">
            <Text className="text-base mb-1 text-gray-700 dark:text-gray-300">Email</Text>
            <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
              <Ionicons name="mail-outline" size={20} color={colors.secondaryText} className="mr-2" />
              <TextInput
                className="flex-1 py-3 text-base text-gray-800 dark:text-white"
                placeholder="Enter your email"
                placeholderTextColor={colors.secondaryText}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {emailError ? <Text className="text-red-500 text-sm mt-1">{emailError}</Text> : null}
          </View>

          <TouchableOpacity 
            className={`py-3 rounded-lg items-center mt-2 ${
              isLoading ? 'bg-emerald-300' : 'bg-emerald-500'
            }`}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text className="text-white text-base font-bold">
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen; 