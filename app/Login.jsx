import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Get users from storage
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      // Find user
      const user = users.find(u => 
        u.email === email.toLowerCase().trim() && u.password === password
      );

      if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        await AsyncStorage.setItem('users', JSON.stringify(users));
        
        // Store current session
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));

        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Error", "Invalid email or password");
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert("Error", "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if user is already logged in (optional)
  React.useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        // Auto-navigate to home if already logged in
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

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
          autoCapitalize="none"
          keyboardType="email-address"
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
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled
          ]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
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
  forgotPassword: {
    color: "#2563eb",
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
  signupText: {
    color: "#6b7280",
    marginTop: 24,
    textAlign: "center",
    fontSize: 16,
  },
  signupLink: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
});