import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignUpScreen: React.FC = () => {
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { signup } = useAuth();
  const { colors } = useTheme();

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password && signupMethod === 'email') {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6 && signupMethod === 'email') {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 0) {
      return '+' + cleaned;
    }
    return cleaned;
  };

  const handleSignUp = async () => {
    const isNameValid = validateName(name);
    let isValid = false;

    if (signupMethod === 'email') {
      isValid = isNameValid && validateEmail(email) && validatePassword(password);
    } else {
      isValid = isNameValid && validatePhoneNumber(phoneNumber);
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const success = await signup(
          name,
          signupMethod === 'email' ? email : phoneNumber,
          signupMethod === 'email' ? password : undefined,
          signupMethod === 'phone'
        );
        if (success) {
          Alert.alert('Success', 'Account created successfully!');
          navigation.goBack();
        } else {
          Alert.alert('Error', 'Failed to create account. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred during sign up. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/BackgroundMan.jpeg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-5">
          <TouchableOpacity 
            className="mt-12 mb-4 flex-row items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
            <Text className="ml-2 text-white text-base font-medium">Back to Login</Text>
          </TouchableOpacity>

          <View className="flex-1 justify-end pb-10">
            <View className="items-center mb-8">
              <Text className="text-4xl font-bold text-white">Create Account</Text>
            </View>

            <View className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 shadow-md backdrop-blur-sm">
              <View className="flex-row mb-6">
                <TouchableOpacity
                  className={`flex-1 py-3 items-center rounded-lg border mx-1 ${
                    signupMethod === 'email' ? 'bg-blue-50 dark:bg-blue-900 border-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onPress={() => setSignupMethod('email')}
                >
                  <Text className={`text-sm font-medium ${
                    signupMethod === 'email' ? 'text-primary dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'
                  }`}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 items-center rounded-lg border mx-1 ${
                    signupMethod === 'phone' ? 'bg-blue-50 dark:bg-blue-900 border-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onPress={() => setSignupMethod('phone')}
                >
                  <Text className={`text-sm font-medium ${
                    signupMethod === 'phone' ? 'text-primary dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'
                  }`}>Phone</Text>
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="text-base mb-1 text-gray-700 dark:text-gray-300">Name</Text>
                <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
                  <Ionicons name="person-outline" size={20} color={colors.secondaryText} className="mr-2" />
                  <TextInput
                    className="flex-1 py-3 text-base text-gray-800 dark:text-white"
                    placeholder="Enter your name"
                    placeholderTextColor={colors.secondaryText}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (nameError) validateName(text);
                    }}
                    editable={!isLoading}
                  />
                </View>
                {nameError ? <Text className="text-red-500 text-sm mt-1">{nameError}</Text> : null}
              </View>

              {signupMethod === 'email' ? (
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
              ) : (
                <View className="mb-4">
                  <Text className="text-base mb-1 text-gray-700 dark:text-gray-300">Phone Number</Text>
                  <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
                    <Ionicons name="phone-portrait-outline" size={20} color={colors.secondaryText} className="mr-2" />
                    <TextInput
                      className="flex-1 py-3 text-base text-gray-800 dark:text-white"
                      placeholder="Enter your phone number"
                      placeholderTextColor={colors.secondaryText}
                      value={phoneNumber}
                      onChangeText={(text) => {
                        const formattedNumber = formatPhoneNumber(text);
                        setPhoneNumber(formattedNumber);
                        if (phoneError) validatePhoneNumber(formattedNumber);
                      }}
                      keyboardType="phone-pad"
                      editable={!isLoading}
                    />
                  </View>
                  {phoneError ? <Text className="text-red-500 text-sm mt-1">{phoneError}</Text> : null}
                </View>
              )}

              {signupMethod === 'email' && (
                <View className="mb-4">
                  <Text className="text-base mb-1 text-gray-700 dark:text-gray-300">Password</Text>
                  <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
                    <Ionicons name="lock-closed-outline" size={20} color={colors.secondaryText} className="mr-2" />
                    <TextInput
                      className="flex-1 py-3 text-base text-gray-800 dark:text-white"
                      placeholder="Enter your password"
                      placeholderTextColor={colors.secondaryText}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) validatePassword(text);
                      }}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                  {passwordError ? <Text className="text-red-500 text-sm mt-1">{passwordError}</Text> : null}
                </View>
              )}

              <TouchableOpacity 
                className={`py-3 rounded-lg items-center mt-2 ${
                  isLoading ? 'bg-emerald-300' : 'bg-emerald-500'
                }`}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text className="text-white text-base font-bold">
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignUpScreen; 