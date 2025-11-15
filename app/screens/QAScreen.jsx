// app/screens/QAScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QAScreen({ route }) {
  const { subject } = route.params || {};
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Q&A for {subject?.name}</Text>
      {/* Add Q&A content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});