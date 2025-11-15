// app/screens/StudyPlannerScreen.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

// Enhanced AI Service Integration
const AIService = {
  openai: null,
  apiKey: null,

  initialize(apiKey) {
    this.apiKey = apiKey;
    console.log('AI Service Initialized');
  },

  async processContent(content, subjectName, action) {
    console.log(`AI Processing: ${action} for ${subjectName}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return this.generateEnhancedResponse(content, subjectName, action);
  },

  async callRealAI(content, subjectName, action) {
    if (!this.apiKey) {
      return this.generateEnhancedResponse(content, subjectName, action);
    }

    try {
      const response = await fetch('https://your-backend-service.com/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          subjectName,
          action,
          apiKey: this.apiKey
        })
      });

      if (!response.ok) throw new Error('AI service unavailable');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Real AI service error:', error);
      return this.generateEnhancedResponse(content, subjectName, action);
    }
  },

  generateEnhancedResponse(content, subjectName, action) {
    const baseContent = content || `Study materials for ${subjectName}`;
    
    const responses = {
      quiz: {
        questions: [
          {
            id: 1,
            question: `What is the primary focus of ${subjectName} based on your study materials?`,
            options: [
              `Understanding core ${subjectName} principles and foundations`,
              `Memorizing ${subjectName} formulas and equations`, 
              `Learning historical context of ${subjectName}`,
              `Focusing on advanced ${subjectName} applications only`
            ],
            correctAnswer: 0,
            explanation: `The materials emphasize building strong foundational knowledge in ${subjectName} before advancing to complex topics.`
          },
          {
            id: 2,
            question: `Which study approach would be most effective for mastering ${subjectName}?`,
            options: [
              'Active recall and spaced repetition',
              'Passive reading and highlighting',
              'Cramming before exams',
              'Relying solely on lecture notes'
            ],
            correctAnswer: 0,
            explanation: 'Research shows active learning techniques significantly improve long-term retention and understanding.'
          },
          {
            id: 3,
            question: `What key concept from ${subjectName} should you master first?`,
            options: [
              'Fundamental principles and basic concepts',
              'Advanced applications and complex theories',
              'Historical development and context',
              'Memorization of all technical terms'
            ],
            correctAnswer: 0,
            explanation: 'Mastering fundamentals creates a solid foundation for understanding more advanced topics.'
          }
        ],
        difficulty: 'intermediate',
        estimatedTime: '15-20 minutes',
        totalQuestions: 3
      },

      summary: {
        summary: `**${subjectName} Study Summary**\n\nThis comprehensive overview covers the essential concepts and principles you need to master ${subjectName}. The material focuses on building a strong foundation through understanding core principles, key definitions, and practical applications.\n\n${baseContent}`,
        
        keyPoints: [
          `Core principles and fundamental concepts of ${subjectName}`,
          'Important terminology and definitions to remember',
          'Practical applications and real-world examples',
          'Common challenges and effective solutions',
          'Key relationships between different concepts'
        ],
        
        studyRecommendations: [
          'Start with basic concepts before moving to advanced topics',
          'Create visual aids like mind maps and diagrams',
          'Practice regularly with real-world examples',
          'Use active recall techniques for better retention',
          'Review material periodically using spaced repetition'
        ],
        
        difficultyLevel: 'Beginner to Intermediate',
        estimatedStudyTime: '2-3 hours for comprehensive understanding',
        priorityTopics: ['Basic Principles', 'Key Definitions', 'Fundamental Applications']
      },

      flashcards: {
        cards: [
          {
            id: 1,
            front: `What is the main goal when studying ${subjectName}?`,
            back: `To understand fundamental principles and develop problem-solving skills that can be applied to real-world situations in ${subjectName}.`
          },
          {
            id: 2,
            front: 'Most effective study technique for long-term retention?',
            back: 'Active recall combined with spaced repetition - testing yourself regularly over increasing time intervals.'
          },
          {
            id: 3,
            front: `How to approach difficult ${subjectName} concepts?`,
            back: 'Break them down into smaller parts, understand each component separately, then see how they connect together.'
          },
          {
            id: 4,
            front: 'What makes a good study session?',
            back: 'Focused, distraction-free environment with clear objectives, active engagement, and regular self-testing.'
          }
        ],
        totalCards: 4,
        recommendedUse: 'Review daily for 10-15 minutes'
      },

      study_plan: {
        plan: [
          {
            day: 'Day 1: Foundation Building',
            tasks: [
              `Review basic ${subjectName} concepts and definitions`,
              'Create summary notes of key principles',
              'Complete foundational practice exercises',
              'Identify areas needing more focus'
            ],
            duration: '1-2 hours',
            focus: 'Understanding core concepts'
          },
          {
            day: 'Day 2: Application Practice',
            tasks: [
              'Work on practical application problems',
              'Review and correct previous exercises',
              'Create flashcards for key terms',
              'Practice explaining concepts aloud'
            ],
            duration: '1.5-2 hours',
            focus: 'Applying knowledge'
          },
          {
            day: 'Day 3: Mastery & Review',
            tasks: [
              'Comprehensive review of all material',
              'Take practice test or quiz',
              'Focus on weak areas identified',
              'Final summary and concept mapping'
            ],
            duration: '1-2 hours',
            focus: 'Reinforcement and assessment'
          }
        ],
        totalDuration: '3 days',
        dailyStudyTime: '1-2 hours per day',
        resources: ['Textbook materials', 'Practice problems', 'Online resources', 'Flashcards'],
        tips: [
          'Take regular breaks during study sessions',
          'Stay consistent with your schedule',
          'Focus on understanding rather than memorization',
          'Test yourself frequently'
        ]
      },

      qa: {
        answer: `Based on the ${subjectName} content you provided, the key concepts involve understanding fundamental principles that serve as building blocks for more advanced topics. The material emphasizes developing a strong foundation through practical application and regular practice.\n\n${content ? `Regarding your specific question about the content, the materials suggest focusing on core principles first, then gradually building up to more complex applications.` : 'I recommend starting with the basic concepts and ensuring you have a solid understanding before moving to advanced topics.'}`,
        confidence: 'High',
        relatedConcepts: [
          'Fundamental Principles',
          'Core Concepts',
          'Practical Applications',
          'Problem-Solving Techniques'
        ],
        followUpQuestions: [
          'How can I apply these concepts in practical scenarios?',
          'What are the most common mistakes to avoid?',
          'How do I know when I have mastered the basics?',
          'What resources would help me practice effectively?'
        ],
        studyTips: [
          'Create a concept map to visualize relationships',
          'Practice with real-world examples',
          'Review regularly using spaced repetition',
          'Teach the concepts to someone else'
        ]
      }
    };

    return responses[action] || responses.summary;
  }
};

export default function StudyPlannerScreen({ navigation }) {
  // Existing states
  const [subjects, setSubjects] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', topic: '', file: null });
  const [newStudyPlan, setNewStudyPlan] = useState({ 
    title: '', 
    date: new Date(), 
    time: new Date(),
    showDatePicker: false,
    showTimePicker: false 
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingAI, setProcessingAI] = useState(false);
  const [aiAction, setAiAction] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);

  // New profile states
  const [userEmail, setUserEmail] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadData();
    initializeAI();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('user_email');
      if (savedEmail) {
        setUserEmail(savedEmail);
      } else {
        // For demo purposes, set a default email
        // In a real app, this would come from your authentication system
        const demoEmail = 'student@university.edu';
        setUserEmail(demoEmail);
        await AsyncStorage.setItem('user_email', demoEmail);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const initializeAI = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('ai_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
        AIService.initialize(savedApiKey);
      }
    } catch (error) {
      console.error('Error initializing AI:', error);
    }
  };

  const loadData = async () => {
    try {
      const subjectsData = await AsyncStorage.getItem('subjects');
      const plansData = await AsyncStorage.getItem('studyPlans');
      
      if (subjectsData) {
        setSubjects(JSON.parse(subjectsData));
      }
      if (plansData) setStudyPlans(JSON.parse(plansData));
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load saved data');
    }
  };

  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      // In a real app, you would verify the current password with your backend
      // For demo purposes, we'll simulate a successful password change
      
      // Save new password (in a real app, this would be hashed and sent to backend)
      await AsyncStorage.setItem('user_password', newPassword);
      
      Alert.alert('Success', 'Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear sensitive data (keep subjects and study plans)
              await AsyncStorage.multiRemove(['ai_api_key', 'user_password']);
              
              // In a real app, you would navigate to login screen
              // navigation.replace('Login');
              
              Alert.alert('Logged Out', 'You have been logged out successfully.');
              setShowProfile(false);
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const pickFile = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        setSelectedFile(result);
        setNewSubject(prev => ({ ...prev, file: result }));
      } else if (result.type === 'cancel') {
        // User cancelled, do nothing
      }
    } catch (err) {
      console.error('File pick error:', err);
      Alert.alert('Error', 'Failed to select file');
    } finally {
      setUploading(false);
    }
  };

  const addSubject = async () => {
    if (!newSubject.name.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    const subjectData = {
      id: Date.now().toString(),
      name: newSubject.name.trim(),
      topic: newSubject.topic.trim(),
      file: newSubject.file,
      createdAt: new Date().toISOString(),
      hasContent: true,
      quizzes: [],
      summaries: [],
      flashcards: [],
      studyPlans: [],
      qaHistory: []
    };

    try {
      const updatedSubjects = [...subjects, subjectData];
      setSubjects(updatedSubjects);
      await saveData('subjects', updatedSubjects);
      
      setNewSubject({ name: '', topic: '', file: null });
      setSelectedFile(null);
      setShowAddSubject(false);
      
      Alert.alert('✅ Success', 'Subject added successfully!');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add subject');
    }
  };

  const generateAIContent = async (subject, action) => {
    try {
      setProcessingAI(true);
      setAiAction(action);
      
      const content = subject.file ? `File: ${subject.file.name}\nTopic: ${subject.topic}` : subject.topic;
      const aiResult = await AIService.processContent(content, subject.name, action);
      
      const updatedSubjects = subjects.map(sub => {
        if (sub.id === subject.id) {
          const update = { ...sub };
          switch (action) {
            case 'quiz':
              update.quizzes = [...(sub.quizzes || []), { ...aiResult, id: Date.now().toString(), createdAt: new Date().toISOString() }];
              break;
            case 'summary':
              update.summaries = [...(sub.summaries || []), { ...aiResult, id: Date.now().toString(), createdAt: new Date().toISOString() }];
              break;
            case 'flashcards':
              update.flashcards = [...(sub.flashcards || []), { ...aiResult, id: Date.now().toString(), createdAt: new Date().toISOString() }];
              break;
            case 'study_plan':
              update.studyPlans = [...(sub.studyPlans || []), { ...aiResult, id: Date.now().toString(), createdAt: new Date().toISOString() }];
              break;
          }
          return update;
        }
        return sub;
      });
      
      setSubjects(updatedSubjects);
      await saveData('subjects', updatedSubjects);
      
      Alert.alert(
        '✅ Success!', 
        `AI has generated your ${getActionDisplayName(action)} for ${subject.name}`,
        [{ text: 'Awesome!', onPress: () => {} }]
      );
      
    } catch (error) {
      console.error('AI Generation error:', error);
      Alert.alert('Error', 'Failed to generate content. Please try again.');
    } finally {
      setProcessingAI(false);
      setAiAction('');
    }
  };

  const getActionDisplayName = (action) => {
    const names = {
      quiz: 'quiz',
      summary: 'summary',
      flashcards: 'flashcards',
      study_plan: 'study plan',
      qa: 'answer'
    };
    return names[action] || 'content';
  };

  // Individual AI generation functions
  const generateQuiz = (subject) => {
    generateAIContent(subject, 'quiz');
  };

  const generateSummary = (subject) => {
    generateAIContent(subject, 'summary');
  };

  const generateFlashcards = (subject) => {
    generateAIContent(subject, 'flashcards');
  };

  const generateStudyPlan = (subject) => {
    generateAIContent(subject, 'study_plan');
  };

  const toggleExpandSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const getFileInfo = (subject) => {
    if (subject.file) {
      return `📎 ${subject.file.name}`;
    }
    if (subject.topic) {
      return `📝 ${subject.topic.substring(0, 40)}${subject.topic.length > 40 ? '...' : ''}`;
    }
    return '📚 No content added';
  };

  const getAIContentStats = (subject) => {
    return {
      quizzes: subject.quizzes?.length || 0,
      summaries: subject.summaries?.length || 0,
      flashcards: subject.flashcards?.length || 0,
      studyPlans: subject.studyPlans?.length || 0,
      qa: subject.qaHistory?.length || 0
    };
  };

  const onDateChange = (event, selectedDate) => {
    setNewStudyPlan(prev => ({
      ...prev,
      showDatePicker: Platform.OS === 'ios',
      date: selectedDate || prev.date
    }));
  };

  const onTimeChange = (event, selectedTime) => {
    setNewStudyPlan(prev => ({
      ...prev,
      showTimePicker: Platform.OS === 'ios',
      time: selectedTime || prev.time
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const createStudyPlan = () => {
    if (!newStudyPlan.title.trim()) {
      Alert.alert('Error', 'Please enter a study topic');
      return;
    }

    const plan = { 
      ...newStudyPlan, 
      id: Date.now().toString(),
      date: formatDate(newStudyPlan.date),
      time: formatTime(newStudyPlan.time),
      createdAt: new Date().toISOString()
    };

    const updatedPlans = [...studyPlans, plan];
    setStudyPlans(updatedPlans);
    saveData('studyPlans', updatedPlans);
    
    setNewStudyPlan({ 
      title: '', 
      date: new Date(), 
      time: new Date(),
      showDatePicker: false,
      showTimePicker: false 
    });
    
    Alert.alert('✅ Success', 'Study plan created successfully!');
  };

  const renderGeneratedContent = (subject) => {
    const stats = getAIContentStats(subject);
    
    return (
      <View style={styles.generatedContent}>
        {/* Summary Section */}
        {stats.summaries > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>📋 Summary</Text>
            <Text style={styles.contentText} numberOfLines={3}>
              {subject.summaries[subject.summaries.length - 1].summary.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 150)}...
            </Text>
            <TouchableOpacity 
              style={styles.viewContentButton}
              onPress={() => navigation.navigate('SummaryScreen', {
                summary: subject.summaries[subject.summaries.length - 1],
                subjectName: subject.name
              })}
            >
              <Text style={styles.viewContentButtonText}>Read Full Summary</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quiz Section */}
        {stats.quizzes > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>🧠 Quiz</Text>
            <Text style={styles.contentText}>
              {subject.quizzes[subject.quizzes.length - 1].questions.length} questions • {subject.quizzes[subject.quizzes.length - 1].estimatedTime}
            </Text>
            <TouchableOpacity 
              style={styles.viewContentButton}
              onPress={() => navigation.navigate('QuizScreen', {
                quiz: subject.quizzes[subject.quizzes.length - 1],
                subjectName: subject.name
              })}
            >
              <Text style={styles.viewContentButtonText}>Take Quiz</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Flashcards Section */}
        {stats.flashcards > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>🎴 Flashcards</Text>
            <Text style={styles.contentText}>
              {subject.flashcards[subject.flashcards.length - 1].totalCards} cards available
            </Text>
            <TouchableOpacity style={styles.viewContentButton}>
              <Text style={styles.viewContentButtonText}>View Flashcards</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Study Plan Section */}
        {stats.studyPlans > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>📅 Study Plan</Text>
            <Text style={styles.contentText}>
              {subject.studyPlans[subject.studyPlans.length - 1].totalDuration} plan
            </Text>
            <TouchableOpacity style={styles.viewContentButton}>
              <Text style={styles.viewContentButtonText}>View Study Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Simplified Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Study Planner</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => setShowProfile(true)}
        >
          <MaterialIcons name="person" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Processing Overlay */}
        {processingAI && (
          <View style={styles.aiProcessingOverlay}>
            <View style={styles.aiProcessingContent}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.aiProcessingText}>
                AI is generating your {aiAction}...
              </Text>
            </View>
          </View>
        )}

        {/* Add Subject Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddSubject(true)}
        >
          <MaterialIcons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New Subject</Text>
        </TouchableOpacity>

        {/* Subjects List */}
        {subjects.length > 0 ? (
          <View style={styles.subjectsContainer}>
            <Text style={styles.subSectionTitle}>Your Study Subjects</Text>
            {subjects.map((subject) => {
              const stats = getAIContentStats(subject);
              const isExpanded = expandedSubject === subject.id;
              
              return (
                <View key={subject.id} style={styles.subjectCard}>
                  <TouchableOpacity 
                    style={styles.subjectHeader}
                    onPress={() => toggleExpandSubject(subject.id)}
                  >
                    <MaterialIcons name="menu-book" size={22} color="#007AFF" />
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <MaterialIcons 
                      name={isExpanded ? "expand-less" : "expand-more"} 
                      size={24} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {/* File Information */}
                  <View style={styles.fileSection}>
                    <MaterialIcons name="description" size={16} color="#007AFF" />
                    <Text style={styles.fileText}>{getFileInfo(subject)}</Text>
                  </View>
                  
                  {/* AI Stats */}
                  <View style={styles.aiStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>🧠</Text>
                      <Text style={styles.statText}>{stats.quizzes}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>📋</Text>
                      <Text style={styles.statText}>{stats.summaries}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>🎴</Text>
                      <Text style={styles.statText}>{stats.flashcards}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>📅</Text>
                      <Text style={styles.statText}>{stats.studyPlans}</Text>
                    </View>
                  </View>
                  
                  {/* AI Generation Buttons */}
                  <View style={styles.aiGenerationSection}>
                    <Text style={styles.aiSectionTitle}>Generate AI Content:</Text>
                    <View style={styles.aiButtonsRow}>
                      <TouchableOpacity 
                        style={styles.aiGenButton}
                        onPress={() => generateQuiz(subject)}
                      >
                        <MaterialIcons name="quiz" size={16} color="white" />
                        <Text style={styles.aiGenButtonText}>Quiz</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.aiGenButton}
                        onPress={() => generateSummary(subject)}
                      >
                        <MaterialIcons name="description" size={16} color="white" />
                        <Text style={styles.aiGenButtonText}>Summary</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.aiGenButton}
                        onPress={() => generateFlashcards(subject)}
                      >
                        <MaterialIcons name="style" size={16} color="white" />
                        <Text style={styles.aiGenButtonText}>Cards</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.aiGenButton}
                        onPress={() => generateStudyPlan(subject)}
                      >
                        <MaterialIcons name="schedule" size={16} color="white" />
                        <Text style={styles.aiGenButtonText}>Plan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Expanded Content */}
                  {isExpanded && renderGeneratedContent(subject)}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="menu-book" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No subjects yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first subject and let AI create study materials for you
            </Text>
          </View>
        )}

        {/* Study Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.subSectionTitle}>📅 Create Study Plan</Text>
          
          <TextInput
            style={styles.input}
            placeholder="What do you want to study?"
            value={newStudyPlan.title}
            onChangeText={(text) => setNewStudyPlan(prev => ({...prev, title: text}))}
          />
          
          <View style={styles.pickerRow}>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setNewStudyPlan(prev => ({...prev, showDatePicker: true}))}
            >
              <MaterialIcons name="calendar-today" size={18} color="#007AFF" />
              <Text style={styles.pickerButtonText}>
                {formatDate(newStudyPlan.date)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setNewStudyPlan(prev => ({...prev, showTimePicker: true}))}
            >
              <MaterialIcons name="access-time" size={18} color="#007AFF" />
              <Text style={styles.pickerButtonText}>
                {formatTime(newStudyPlan.time)}
              </Text>
            </TouchableOpacity>
          </View>

          {newStudyPlan.showDatePicker && (
            <DateTimePicker
              value={newStudyPlan.date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {newStudyPlan.showTimePicker && (
            <DateTimePicker
              value={newStudyPlan.time}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <TouchableOpacity 
            style={[
              styles.primaryButton, 
              !newStudyPlan.title.trim() && styles.buttonDisabled
            ]} 
            onPress={createStudyPlan}
            disabled={!newStudyPlan.title.trim()}
          >
            <MaterialIcons name="schedule" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Create Study Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.subSectionTitle}>🗓️ Study Calendar</Text>
          <Calendar
            style={styles.calendar}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#007AFF',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#007AFF',
              selectedDotColor: '#ffffff',
              arrowColor: '#007AFF',
              monthTextColor: '#2d4150',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
            }}
            markedDates={{
              [new Date().toISOString().split('T')[0]]: { 
                selected: true, 
                selectedColor: '#007AFF',
                selectedTextColor: '#ffffff'
              }
            }}
          />
        </View>
      </ScrollView>

      {/* Add Subject Modal */}
      <Modal 
        visible={showAddSubject} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setShowAddSubject(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Subject</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Subject name *"
              value={newSubject.name}
              onChangeText={(text) => setNewSubject(prev => ({...prev, name: text}))}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Topic description or key concepts"
              value={newSubject.topic}
              onChangeText={(text) => setNewSubject(prev => ({...prev, topic: text}))}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickFile}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialIcons name="attach-file" size={20} color="white" />
              )}
              <Text style={styles.uploadButtonText}>
                {selectedFile ? 'Change File' : 'Attach File (Optional)'}
              </Text>
            </TouchableOpacity>

            {selectedFile && (
              <View style={styles.fileInfo}>
                <MaterialIcons name="description" size={16} color="#007AFF" />
                <Text style={styles.fileName}>{selectedFile.name}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setShowAddSubject(false);
                  setNewSubject({ name: '', topic: '', file: null });
                  setSelectedFile(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  !newSubject.name.trim() && styles.buttonDisabled
                ]} 
                onPress={addSubject}
                disabled={!newSubject.name.trim()}
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Add Subject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal 
        visible={showProfile} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>👤 Profile</Text>
            
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                <MaterialIcons name="person" size={40} color="white" />
              </View>
              <Text style={styles.profileName}>Student User</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>

            <View style={styles.profileStats}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{subjects.length}</Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {subjects.reduce((total, subject) => total + (subject.quizzes?.length || 0), 0)}
                </Text>
                <Text style={styles.statLabel}>Quizzes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {subjects.reduce((total, subject) => total + (subject.summaries?.length || 0), 0)}
                </Text>
                <Text style={styles.statLabel}>Summaries</Text>
              </View>
            </View>

            {/* Profile Actions */}
            <View style={styles.profileActions}>
              <TouchableOpacity 
                style={styles.profileActionButton}
                onPress={() => setShowChangePassword(true)}
              >
                <MaterialIcons name="lock" size={20} color="#007AFF" />
                <Text style={styles.profileActionText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.profileActionButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={20} color="#FF3B30" />
                <Text style={[styles.profileActionText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setShowProfile(false)}
            >
              <Text style={styles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal 
        visible={showChangePassword} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setShowChangePassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  (!currentPassword || !newPassword || !confirmPassword) && styles.buttonDisabled
                ]} 
                onPress={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                <MaterialIcons name="lock-reset" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Header Styles
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileButton: {
    padding: 8,
  },
  // Main Content
  content: {
    flex: 1,
    padding: 16,
  },
  // AI Processing
  aiProcessingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  aiProcessingContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
  },
  aiProcessingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Add Button
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Subjects
  subjectsContainer: {
    marginBottom: 20,
  },
  subjectCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
    flex: 1,
  },
  // File Section
  fileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  fileText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
    flex: 1,
  },
  // AI Stats
  aiStats: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  // AI Generation Section
  aiGenerationSection: {
    marginBottom: 12,
  },
  aiSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  aiButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiGenButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  aiGenButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Generated Content
  generatedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  contentSection: {
    marginBottom: 12,
  },
  contentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  viewContentButton: {
    backgroundColor: '#5856D6',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewContentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Plans Section
  plansSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 6,
    fontWeight: '500',
  },
  // Calendar
  calendarSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 8,
  },
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  // Buttons
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd',
  },
  // Upload
  uploadButton: {
    backgroundColor: '#5856D6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fileInfo: {
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileName: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
    flex: 1,
  },
  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  // Profile
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // Profile Actions
  profileActions: {
    marginBottom: 24,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 12,
  },
  profileActionText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
  },
});