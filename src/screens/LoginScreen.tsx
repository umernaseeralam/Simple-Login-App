import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  useWindowDimensions,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import the RootStackParamList from the AppNavigator
type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  SignUp: undefined;
  EditProfile: undefined;
  Auth: undefined;
  ProfileTab: undefined;
  ForgotPassword: undefined;
};

const LoginScreen: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { login } = useAuth();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phone) {
      setPhoneError("Phone number is required");
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password && loginMethod === "email") {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6 && loginMethod === "email") {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, "");
    // Format as international phone number
    if (cleaned.length > 0) {
      return "+" + cleaned;
    }
    return cleaned;
  };

  const handleLogin = async () => {
    let isValid = false;

    if (loginMethod === "email") {
      isValid = validateEmail(email) && validatePassword(password);
    } else {
      isValid = validatePhoneNumber(phoneNumber);
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const success = await login(
          loginMethod === "email" ? email : phoneNumber,
          loginMethod === "email" ? password : ""
        );
        if (!success) {
          Alert.alert(
            "Login Failed",
            `Invalid ${loginMethod}${
              loginMethod === "email" ? " or password" : ""
            }. Please try again.`
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Main" }],
            })
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred during login. Please try again."
        );
        console.log("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/BackgroundMan.jpeg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? (isLandscape ? 30 : 64) : 0
        }
      >
        <ScrollView className="flex-1 px-5">
          <TouchableOpacity
            className="mt-12 mb-4 flex-row items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
            <Text className="ml-2 text-white text-base font-medium">Back</Text>
          </TouchableOpacity>

          <View
            className="flex-1 justify-end"
            style={{ minHeight: height * 0.9 }}
          >
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-white">
                Brickell Watches
              </Text>
            </View>

            <View className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 shadow-md backdrop-blur-sm mb-5">
              <Text className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                Login
              </Text>

              <View className="flex-row mb-6">
                <TouchableOpacity
                  className={`flex-1 py-3 items-center rounded-lg border mx-1 ${
                    loginMethod === "email"
                      ? "bg-blue-50 dark:bg-blue-900 border-primary"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onPress={() => setLoginMethod("email")}
                >
                  <Text
                    className={`text-sm font-medium ${
                      loginMethod === "email"
                        ? "text-primary dark:text-white font-bold"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 items-center rounded-lg border mx-1 ${
                    loginMethod === "phone"
                      ? "bg-blue-50 dark:bg-blue-900 border-primary"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onPress={() => setLoginMethod("phone")}
                >
                  <Text
                    className={`text-sm font-medium ${
                      loginMethod === "phone"
                        ? "text-primary dark:text-white font-bold"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              {loginMethod === "email" ? (
                <View className="mb-4">
                  <Text className="text-base mb-1 text-gray-700 dark:text-gray-300">
                    Email
                  </Text>
                  <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.secondaryText}
                      className="mr-2"
                    />
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
                  {emailError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {emailError}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View className="mb-4">
                  <Text className="text-base mb-1 text-gray-700 dark:text-gray-300">
                    Phone Number
                  </Text>
                  <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
                    <Ionicons
                      name="phone-portrait-outline"
                      size={20}
                      color={colors.secondaryText}
                      className="mr-2"
                    />
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
                  {phoneError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {phoneError}
                    </Text>
                  ) : null}
                </View>
              )}

              {loginMethod === "email" && (
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base text-gray-700 dark:text-gray-300">
                      Password
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ForgotPassword" as never)
                      }
                    >
                      <Text className="text-sm text-primary dark:text-blue-400">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row items-center border rounded-lg px-3 border-gray-300 dark:border-gray-600">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.secondaryText}
                      className="mr-2"
                    />
                    <TextInput
                      className="flex-1 py-3 text-base text-gray-800 dark:text-white"
                      placeholder="Enter your password"
                      placeholderTextColor={colors.secondaryText}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) validatePassword(text);
                      }}
                      secureTextEntry={!isPasswordVisible}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <Ionicons
                        name={
                          isPasswordVisible ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color={colors.secondaryText}
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {passwordError}
                    </Text>
                  ) : null}
                </View>
              )}

              <TouchableOpacity
                className={`py-3 rounded-lg items-center mt-2 ${
                  isLoading ? "bg-emerald-300" : "bg-emerald-500"
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text className="text-white text-base font-bold">
                  {isLoading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SignUp" as never)}
                  disabled={isLoading}
                >
                  <Text className="text-sm text-primary dark:text-blue-400 font-bold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
