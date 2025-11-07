// app/screens/ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const subjectsData = await AsyncStorage.getItem('subjects');
      const quizzesData = await AsyncStorage.getItem('quizzes');
      
      if (subjectsData) setSubjects(JSON.parse(subjectsData));
      if (quizzesData) setQuizzes(JSON.parse(quizzesData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>👤 Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Icon name="person" size={40} color="white" />
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileItem}>
            <Icon name="school" size={16} color="#6b7280" /> Example University
          </Text>
          <Text style={styles.profileItem}>
            <Icon name="menu-book" size={16} color="#6b7280" /> {subjects.length} Subjects
          </Text>
          <Text style={styles.profileItem}>
            <Icon name="quiz" size={16} color="#6b7280" /> {quizzes.length} Quizzes Taken
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Icon name="logout" size={20} color="white" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
  },
  profileInfo: {
    width: '100%',
  },
  profileItem: {
    fontSize: 16,
    marginBottom: 12,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});