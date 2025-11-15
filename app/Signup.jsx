import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const userExists = users.find(user => user.email === email);
      if (userExists) {
        Alert.alert("Error", "An account with this email already exists");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase().trim(),
        password: password, // In real app, hash this password
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save user to storage
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Also store current session
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Home") }
      ]);

    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
          autoCapitalize="none"
          keyboardType="email-address"
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
          onPress={handleSignup}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled
          ]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating Account..." : "Create Account"}
          </Text>
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
    backgroundColor: "#dbeafe",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 448,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    padding: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    color: "#1d4ed8",
    marginBottom: 24,
  },
  subtitle: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: "#1d4ed8",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  termsText: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
  termsLink: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  loginRedirect: {
    color: "#6b7280",
    marginTop: 24,
    textAlign: "center",
    fontSize: 16,
  },
  loginLink: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
});