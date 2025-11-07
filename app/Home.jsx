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
  Animated,
  Dimensions
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subjects, setSubjects] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [resources, setResources] = useState([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newStudyPlan, setNewStudyPlan] = useState({ title: '', date: '', time: '' });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-280));

  // Sample initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const defaultSubjects = ['Mathematics', 'Physics', 'Chemistry'];
    const defaultQuizzes = [
      { id: 1, title: 'Math Quiz 1', score: 85, total: 100 },
      { id: 2, title: 'Physics Quiz 1', score: 72, total: 100 }
    ];
    const defaultStudyPlans = [
      { id: 1, title: 'Algebra Revision', date: '2024-01-15', time: '14:00' },
      { id: 2, title: 'Physics Lab Report', date: '2024-01-16', time: '16:00' }
    ];
    
    setSubjects(defaultSubjects);
    setQuizzes(defaultQuizzes);
    setStudyPlans(defaultStudyPlans);
  };

  // Sidebar Animation
  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnim, {
        toValue: -280,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNavItemPress = (tab) => {
    setActiveTab(tab);
    toggleSidebar();
  };

  // B. Study Planner Functions
  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
      setShowAddSubject(false);
      Alert.alert('Success', 'Subject added successfully!');
    }
  };

  const createStudyPlan = () => {
    if (newStudyPlan.title && newStudyPlan.date) {
      setStudyPlans([...studyPlans, { ...newStudyPlan, id: Date.now() }]);
      setNewStudyPlan({ title: '', date: '', time: '' });
      Alert.alert('Success', 'Study plan created!');
    }
  };

  // C. Quiz Functions
  const takeQuiz = (subject) => {
    Alert.alert('Quiz Started', `Starting ${subject} quiz`);
    // Navigate to quiz screen or show quiz modal
  };

  // D. Progress Tracking
  const getTotalStudyHours = () => {
    return studyPlans.length * 2;
  };

  const getAverageScore = () => {
    if (quizzes.length === 0) return 0;
    const total = quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
    return Math.round(total / quizzes.length);
  };

  const getCompletedTopics = () => {
    return Math.floor(subjects.length * 0.7); // Mock data
  };

  // Navigation items with icons
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { key: 'planner', label: 'Study Planner', icon: 'schedule' },
    { key: 'quizzes', label: 'Quizzes', icon: 'quiz' },
    { key: 'progress', label: 'Progress', icon: 'trending-up' },
    { key: 'resources', label: 'Resources', icon: 'library-books' },
    { key: 'profile', label: 'Profile', icon: 'person' },
  ];

  // Render different sections based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'planner':
        return renderStudyPlanner();
      case 'quizzes':
        return renderQuizzes();
      case 'progress':
        return renderProgress();
      case 'resources':
        return renderResources();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome back, John! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Ready to continue your learning journey?</Text>
        </View>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color="white" />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatCard}>
          <Icon name="access-time" size={24} color="#2563eb" />
          <Text style={styles.quickStatNumber}>{getTotalStudyHours()}h</Text>
          <Text style={styles.quickStatLabel}>Study Time</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Icon name="star" size={24} color="#10b981" />
          <Text style={styles.quickStatNumber}>{getAverageScore()}%</Text>
          <Text style={styles.quickStatLabel}>Avg Score</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Icon name="check-circle" size={24} color="#f59e0b" />
          <Text style={styles.quickStatNumber}>{getCompletedTopics()}</Text>
          <Text style={styles.quickStatLabel}>Topics Done</Text>
        </View>
      </View>

      {/* Today's Focus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Today's Focus</Text>
        <View style={styles.focusCard}>
          <Icon name="target" size={32} color="#8b5cf6" />
          <View style={styles.focusContent}>
            <Text style={styles.focusTitle}>Complete Algebra Chapter</Text>
            <Text style={styles.focusSubtitle}>2 hours planned • Due tomorrow</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.progressText}>60% completed</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Sessions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 Upcoming Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        {studyPlans.slice(0, 2).map(plan => (
          <View key={plan.id} style={styles.sessionCard}>
            <View style={styles.sessionIcon}>
              <Icon name="schedule" size={20} color="#2563eb" />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>{plan.title}</Text>
              <Text style={styles.sessionTime}>{plan.date} • {plan.time}</Text>
            </View>
            <TouchableOpacity style={styles.sessionButton}>
              <Text style={styles.sessionButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Recent Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Recent Performance</Text>
        <View style={styles.performanceCard}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Mathematics</Text>
            <View style={styles.performanceBar}>
              <View style={[styles.performanceFill, { width: '85%', backgroundColor: '#10b981' }]} />
            </View>
            <Text style={styles.performanceValue}>85%</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Physics</Text>
            <View style={styles.performanceBar}>
              <View style={[styles.performanceFill, { width: '72%', backgroundColor: '#f59e0b' }]} />
            </View>
            <Text style={styles.performanceValue}>72%</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Chemistry</Text>
            <View style={styles.performanceBar}>
              <View style={[styles.performanceFill, { width: '68%', backgroundColor: '#ef4444' }]} />
            </View>
            <Text style={styles.performanceValue}>68%</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Icon name="play-arrow" size={24} color="#2563eb" />
            </View>
            <Text style={styles.actionText}>Start Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Icon name="add" size={24} color="#10b981" />
            </View>
            <Text style={styles.actionText}>Add Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Icon name="library-books" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.actionText}>Resources</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderStudyPlanner = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>📚 Study Planner</Text>
      
      {/* Add Subject */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddSubject(true)}
      >
        <Icon name="add" size={20} color="white" />
        <Text style={styles.addButtonText}>Add Subject</Text>
      </TouchableOpacity>

      {/* Subjects List */}
      <View style={styles.subjectsContainer}>
        {subjects.map((subject, index) => (
          <View key={index} style={styles.subjectCard}>
            <Icon name="menu-book" size={24} color="#2563eb" />
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectName}>{subject}</Text>
            </View>
            <TouchableOpacity 
              style={styles.quizSmallButton}
              onPress={() => takeQuiz(subject)}
            >
              <Text style={styles.quizSmallButtonText}>Take Quiz</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Calendar View */}
      <View style={styles.calendarSection}>
        <Text style={styles.subSectionTitle}>🗓️ Study Calendar</Text>
        <Calendar
          style={styles.calendar}
          markedDates={{
            [new Date().toISOString().split('T')[0]]: { selected: true, selectedColor: '#2563eb' }
          }}
        />
      </View>

      {/* Add Study Plan */}
      <View style={styles.addPlanSection}>
        <Text style={styles.subSectionTitle}>➕ Create Study Plan</Text>
        <TextInput
          style={styles.input}
          placeholder="Study topic"
          value={newStudyPlan.title}
          onChangeText={(text) => setNewStudyPlan({...newStudyPlan, title: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={newStudyPlan.date}
          onChangeText={(text) => setNewStudyPlan({...newStudyPlan, date: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={newStudyPlan.time}
          onChangeText={(text) => setNewStudyPlan({...newStudyPlan, time: text})}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={createStudyPlan}>
          <Icon name="add" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Create Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderQuizzes = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>🧠 Quiz Section</Text>
      
      <View style={styles.quizStats}>
        <Text style={styles.quizStatsText}>Average Score: {getAverageScore()}%</Text>
        <Text style={styles.quizStatsText}>Quizzes Taken: {quizzes.length}</Text>
      </View>

      {quizzes.map(quiz => (
        <View key={quiz.id} style={styles.quizItem}>
          <Icon name="assignment" size={24} color="#2563eb" />
          <View style={styles.quizInfo}>
            <Text style={styles.quizItemTitle}>{quiz.title}</Text>
            <Text style={styles.quizItemScore}>Score: {quiz.score}%</Text>
          </View>
          <TouchableOpacity style={styles.retakeButton}>
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.primaryButton}>
        <Icon name="play-arrow" size={20} color="white" />
        <Text style={styles.primaryButtonText}>Start New Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderProgress = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>📈 Progress Tracker</Text>
      
      <View style={styles.progressCard}>
        <Icon name="access-time" size={32} color="#2563eb" />
        <View style={styles.progressText}>
          <Text style={styles.progressTitle}>Study Hours</Text>
          <Text style={styles.progressValue}>{getTotalStudyHours()} hours</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Icon name="school" size={32} color="#10b981" />
        <View style={styles.progressText}>
          <Text style={styles.progressTitle}>Subjects Mastered</Text>
          <Text style={styles.progressValue}>{subjects.length} subjects</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Icon name="bar-chart" size={32} color="#f59e0b" />
        <View style={styles.progressText}>
          <Text style={styles.progressTitle}>Quiz Performance</Text>
          <Text style={styles.progressValue}>{getAverageScore()}% average</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderResources = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>📚 Resource Library</Text>
      <View style={styles.comingSoonContainer}>
        <Icon name="cloud-download" size={64} color="#6b7280" />
        <Text style={styles.comingSoon}>Resource library coming soon...</Text>
        <Text style={styles.comingSoonSubtitle}>Upload PDFs, videos, and notes</Text>
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
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

  return (
    <View style={styles.container}>
      {/* Header with Hamburger Menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {navItems.find(item => item.key === activeTab)?.label}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="notifications" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="search" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated Sidebar */}
      <Animated.View style={[
        styles.sidebar,
        { transform: [{ translateX: sidebarAnim }] }
      ]}>
        {/* Sidebar Content */}
        <View style={styles.sidebarContent}>
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarAvatar}>
              <Icon name="school" size={32} color="white" />
            </View>
            <Text style={styles.sidebarAppTitle}>StudySmart</Text>
            <Text style={styles.sidebarSubtitle}>Your Learning Companion</Text>
          </View>

          <View style={styles.navContainer}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.navItem,
                  activeTab === item.key && styles.activeNavItem
                ]}
                onPress={() => handleNavItemPress(item.key)}
              >
                <Icon 
                  name={item.icon} 
                  size={24} 
                  color={activeTab === item.key ? '#2563eb' : '#9ca3af'} 
                />
                <Text style={[
                  styles.navText,
                  activeTab === item.key && styles.activeNavText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sidebarFooter}>
            <View style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Icon name="person" size={24} color="white" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>John Doe</Text>
                <Text style={styles.userEmail}>Student</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.logoutButtonSidebar}
              onPress={() => navigation.navigate('Login')}
            >
              <Icon name="logout" size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overlay to close sidebar when clicking outside */}
        {sidebarVisible && (
          <TouchableOpacity 
            style={styles.overlay}
            onPress={toggleSidebar}
          />
        )}
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      {/* Add Subject Modal */}
      <Modal visible={showAddSubject} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject name"
              value={newSubject}
              onChangeText={setNewSubject}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowAddSubject(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={addSubject}>
                <Text style={styles.primaryButtonText}>Add Subject</Text>
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
    backgroundColor: '#f8fafc',
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
  menuButton: {
    padding: 8,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#374151',
    marginVertical: 2,
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 10,
  },
  // Sidebar Styles
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    zIndex: 1000,
  },
  sidebarContent: {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarHeader: {
    backgroundColor: '#2563eb',
    padding: 25,
    paddingTop: 60,
    alignItems: 'center',
  },
  sidebarAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  sidebarAppTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sidebarSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  navContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 5,
  },
  activeNavItem: {
    backgroundColor: '#f3f4f6',
  },
  navText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  activeNavText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButtonSidebar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  overlay: {
    position: 'absolute',
    left: 280,
    right: -1000,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Main Content
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // Dashboard Landing Page Styles
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickStatCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 5,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  focusCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  focusContent: {
    flex: 1,
    marginLeft: 15,
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  focusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  sessionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sessionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  performanceCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  performanceLabel: {
    width: 80,
    fontSize: 14,
    color: '#374151',
  },
  performanceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  performanceFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  // Study Planner Styles
  addButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  subjectsContainer: {
    marginBottom: 20,
  },
  subjectCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  subjectInfo: {
    flex: 1,
    marginLeft: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  quizSmallButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quizSmallButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  calendarSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  calendar: {
    borderRadius: 12,
  },
  addPlanSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  // Quiz Styles
  quizStats: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  quizStatsText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 5,
  },
  quizItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizInfo: {
    flex: 1,
    marginLeft: 12,
  },
  quizItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  quizItemScore: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  retakeButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retakeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  // Progress Styles
  progressCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    marginLeft: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  // Resources Styles
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  comingSoon: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '500',
  },
  comingSoonSubtitle: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
  },
  // Profile Styles
  profileCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileInfo: {
    width: '100%',
  },
  profileItem: {
    fontSize: 16,
    marginBottom: 12,
    color: '#374151',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 16,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});