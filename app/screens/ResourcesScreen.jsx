// app/screens/ResourcesScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResourcesScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const subjectsData = await AsyncStorage.getItem('subjects');
      const resourcesData = await AsyncStorage.getItem('savedResources');
      
      if (subjectsData) {
        setSubjects(JSON.parse(subjectsData));
      }
      if (resourcesData) {
        setSavedResources(JSON.parse(resourcesData));
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const studyResources = [
    {
      id: 1,
      title: 'Khan Academy',
      description: 'Free online courses, lessons & practice',
      category: 'general',
      url: 'https://www.khanacademy.org',
      icon: 'school',
      color: '#3B82F6'
    },
    {
      id: 2,
      title: 'Coursera',
      description: 'Online courses from top universities',
      category: 'general',
      url: 'https://www.coursera.org',
      icon: 'language',
      color: '#10B981'
    },
    {
      id: 3,
      title: 'Quizlet',
      description: 'Digital flashcards and study tools',
      category: 'tools',
      url: 'https://quizlet.com',
      icon: 'flash-on',
      color: '#F59E0B'
    },
    {
      id: 4,
      title: 'Wolfram Alpha',
      description: 'Computational intelligence for math and science',
      category: 'tools',
      url: 'https://www.wolframalpha.com',
      icon: 'calculate',
      color: '#EF4444'
    },
    {
      id: 5,
      title: 'Duolingo',
      description: 'Free language learning platform',
      category: 'languages',
      url: 'https://www.duolingo.com',
      icon: 'translate',
      color: '#8B5CF6'
    },
    {
      id: 6,
      title: 'Codecademy',
      description: 'Learn to code interactively',
      category: 'programming',
      url: 'https://www.codecademy.com',
      icon: 'code',
      color: '#06B6D4'
    },
    {
      id: 7,
      title: 'Google Scholar',
      description: 'Search scholarly literature',
      category: 'research',
      url: 'https://scholar.google.com',
      icon: 'search',
      color: '#EC4899'
    },
    {
      id: 8,
      title: 'Notion',
      description: 'All-in-one workspace for notes and planning',
      category: 'tools',
      url: 'https://www.notion.so',
      icon: 'description',
      color: '#000000'
    }
  ];

  const studyTips = [
    {
      id: 1,
      title: 'Pomodoro Technique',
      description: 'Study in 25-minute intervals with 5-minute breaks',
      icon: 'timer',
      category: 'technique'
    },
    {
      id: 2,
      title: 'Active Recall',
      description: 'Test yourself regularly to strengthen memory',
      icon: 'psychology',
      category: 'technique'
    },
    {
      id: 3,
      title: 'Spaced Repetition',
      description: 'Review material at increasing intervals',
      icon: 'update',
      category: 'technique'
    },
    {
      id: 4,
      title: 'Mind Mapping',
      description: 'Visualize concepts and their relationships',
      icon: 'account-tree',
      category: 'visualization'
    },
    {
      id: 5,
      title: 'Teach Others',
      description: 'Explain concepts to solidify understanding',
      icon: 'record-voice-over',
      category: 'practice'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: 'apps' },
    { id: 'general', name: 'General Learning', icon: 'school' },
    { id: 'tools', name: 'Study Tools', icon: 'build' },
    { id: 'programming', name: 'Programming', icon: 'code' },
    { id: 'languages', name: 'Languages', icon: 'translate' },
    { id: 'research', name: 'Research', icon: 'search' }
  ];

  const filteredResources = activeCategory === 'all' 
    ? studyResources 
    : studyResources.filter(resource => resource.category === activeCategory);

  const handleOpenResource = async (resource) => {
    try {
      const supported = await Linking.canOpenURL(resource.url);
      if (supported) {
        await Linking.openURL(resource.url);
      } else {
        Alert.alert('Error', `Cannot open URL: ${resource.url}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open resource');
    }
  };

  const handleSaveResource = (resource) => {
    const isAlreadySaved = savedResources.some(saved => saved.id === resource.id);
    
    if (isAlreadySaved) {
      // Remove from saved
      const updatedSaved = savedResources.filter(saved => saved.id !== resource.id);
      setSavedResources(updatedSaved);
      AsyncStorage.setItem('savedResources', JSON.stringify(updatedSaved));
      Alert.alert('Removed', 'Resource removed from saved');
    } else {
      // Add to saved
      const updatedSaved = [...savedResources, { ...resource, savedAt: new Date().toISOString() }];
      setSavedResources(updatedSaved);
      AsyncStorage.setItem('savedResources', JSON.stringify(updatedSaved));
      Alert.alert('Saved', 'Resource added to saved list');
    }
  };

  const isResourceSaved = (resourceId) => {
    return savedResources.some(resource => resource.id === resourceId);
  };

  const ResourceCard = ({ resource }) => (
    <View style={styles.resourceCard}>
      <View style={styles.resourceHeader}>
        <View style={[styles.resourceIcon, { backgroundColor: resource.color }]}>
          <MaterialIcons name={resource.icon} size={20} color="white" />
        </View>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
          <Text style={styles.resourceDescription}>{resource.description}</Text>
        </View>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => handleSaveResource(resource)}
        >
          <MaterialIcons 
            name={isResourceSaved(resource.id) ? "bookmark" : "bookmark-border"} 
            size={20} 
            color={isResourceSaved(resource.id) ? "#2563EB" : "#6B7280"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.resourceActions}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => handleOpenResource(resource)}
        >
          <MaterialIcons name="open-in-new" size={16} color="#2563EB" />
          <Text style={styles.secondaryButtonText}>Visit Website</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const StudyTipCard = ({ tip }) => (
    <View style={styles.tipCard}>
      <MaterialIcons name={tip.icon} size={24} color="#2563EB" />
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipDescription}>{tip.description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Resources...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Resources</Text>
        <Text style={styles.headerSubtitle}>Tools and tips for effective learning</Text>
      </View>

      {/* Study Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Effective Study Techniques</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tipsScrollView}
        >
          {studyTips.map(tip => (
            <StudyTipCard key={tip.id} tip={tip} />
          ))}
        </ScrollView>
      </View>

      {/* Category Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Study Tools & Resources</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <MaterialIcons 
                name={category.icon} 
                size={16} 
                color={activeCategory === category.id ? 'white' : '#6B7280'} 
              />
              <Text style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resources Grid */}
      <View style={styles.section}>
        <View style={styles.resourcesGrid}>
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </View>
      </View>

      {/* Your Subjects Resources */}
      {subjects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Your Subjects</Text>
          <View style={styles.subjectsGrid}>
            {subjects.map((subject, index) => (
              <TouchableOpacity 
                key={subject.id}
                style={styles.subjectCard}
                onPress={() => navigation.navigate('StudyPlanner')}
              >
                <View style={[
                  styles.subjectIcon,
                  { backgroundColor: `hsl(${index * 60}, 70%, 50%)` }
                ]}>
                  <MaterialIcons name="menu-book" size={20} color="white" />
                </View>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectResources}>
                  {subject.quizzes?.length || 0} quizzes • {subject.summaries?.length || 0} summaries
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Saved Resources */}
      {savedResources.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Saved Resources</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.savedResourcesList}>
            {savedResources.slice(0, 3).map(resource => (
              <View key={resource.id} style={styles.savedResourceItem}>
                <MaterialIcons name="bookmark" size={16} color="#2563EB" />
                <Text style={styles.savedResourceTitle}>{resource.title}</Text>
                <TouchableOpacity onPress={() => handleOpenResource(resource)}>
                  <MaterialIcons name="open-in-new" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('StudyPlanner')}
          >
            <MaterialIcons name="add" size={24} color="#10B981" />
            <Text style={styles.quickActionTitle}>Add Subject</Text>
            <Text style={styles.quickActionDesc}>Create new study material</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Progress')}
          >
            <MaterialIcons name="analytics" size={24} color="#3B82F6" />
            <Text style={styles.quickActionTitle}>View Progress</Text>
            <Text style={styles.quickActionDesc}>Check your learning stats</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  tipsScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  categoriesScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: 'white',
  },
  resourcesGrid: {
    gap: 16,
  },
  resourceCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  saveButton: {
    padding: 4,
  },
  resourceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 6,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subjectResources: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  savedResourcesList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  savedResourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  savedResourceTitle: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  quickActionDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});