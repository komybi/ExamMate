import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Join us today! It only takes a few steps</Text>

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
          placeholder="Enter password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Signup Button */}
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By signing up, you agree to our{" "}
          <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
        </Text>

        {/* Login Redirect */}
        <Text style={styles.loginRedirect}>
          Already have an account?{" "}
          <Text 
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            Login
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
    maxWidth: 448, // max-w-md (448px) - matching Login component
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
    fontSize: 36, // text-4xl - matching Login component
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
  termsText: {
    color: "#6b7280", // text-gray-500
    fontSize: 12, // text-xs
    textAlign: "center", // text-center
    marginTop: 12, // mt-3
  },
  termsLink: {
    color: "#2563eb", // text-blue-600
    textDecorationLine: "underline", // underline
  },
  loginRedirect: {
    color: "#6b7280", // text-gray-600
    marginTop: 24, // mt-6
    textAlign: "center", // text-center
    fontSize: 16,
  },
  loginLink: {
    color: "#1d4ed8", // text-blue-700
    fontWeight: "600", // font-semibold
  },
});