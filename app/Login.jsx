import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue to your account</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>

        {/* Forgot Password */}
        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        {/* Signup Link */}
        <Text style={styles.signupText}>
          Don't have an account?{" "}
          <Text 
            style={styles.signupLink}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dbeafe", // from-blue-100
    paddingHorizontal: 24, // px-6
  },
  card: {
    backgroundColor: "white", // bg-white
    width: "100%", // w-full
    maxWidth: 448, // max-w-md (448px)
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000", // shadow-2xl
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    padding: 32, // p-8
  },
  title: {
    fontSize: 36, // text-4xl
    fontWeight: "800", // font-extrabold
    textAlign: "center", // text-center
    color: "#1d4ed8", // text-blue-700
    marginBottom: 24, // mb-6
  },
  subtitle: {
    color: "#6b7280", // text-gray-600
    textAlign: "center", // text-center
    marginBottom: 32, // mb-8
    fontSize: 16,
  },
  input: {
    width: "100%", // w-full
    borderWidth: 1, // border
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
    marginBottom: 16, // mb-4
    fontSize: 16, // text-base
    backgroundColor: "#f9fafb", // bg-gray-50
    shadowColor: "#000", // shadow-sm
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: "100%", // w-full
    backgroundColor: "#2563eb", // bg-blue-600
    borderRadius: 12, // rounded-xl
    paddingVertical: 12, // py-3
    shadowColor: "#000", // shadow-lg
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: "#1d4ed8", // active:bg-blue-700
  },
  buttonText: {
    textAlign: "center", // text-center
    color: "white", // text-white
    fontWeight: "600", // font-semibold
    fontSize: 18, // text-lg
    letterSpacing: 0.5, // tracking-wide
  },
  forgotPassword: {
    color: "#2563eb", // text-blue-600
    marginTop: 16, // mt-4
    fontSize: 14, // text-sm
    textAlign: "center", // text-center
  },
  signupText: {
    color: "#6b7280", // text-gray-600
    marginTop: 24, // mt-6
    textAlign: "center", // text-center
    fontSize: 16,
  },
  signupLink: {
    color: "#1d4ed8", // text-blue-700
    fontWeight: "600", // font-semibold
  },
});