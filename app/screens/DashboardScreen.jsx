// app/screens/DashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalQuizzes: 0,
    totalStudyTime: 0,
    averageScore: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const subjectsData = await AsyncStorage.getItem('subjects');
      const plansData = await AsyncStorage.getItem('studyPlans');
      
      if (subjectsData) {
        const parsedSubjects = JSON.parse(subjectsData);
        setSubjects(parsedSubjects);
        
        // Calculate stats
        const totalQuizzes = parsedSubjects.reduce((sum, subject) => 
          sum + (subject.quizzes?.length || 0), 0
        );
        
        const completedQuizzes = parsedSubjects.flatMap(subject => 
          subject.quizzes?.filter(quiz => quiz.completed) || []
        );
        
        const averageScore = completedQuizzes.length > 0 
          ? completedQuizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / completedQuizzes.length 
          : 0;

        setStats({
          totalSubjects: parsedSubjects.length,
          totalQuizzes: totalQuizzes,
          totalStudyTime: parsedSubjects.length * 2, // Mock data
          averageScore: Math.round(averageScore)
        });

        // Recent activity
        const activity = [];
        parsedSubjects.forEach(subject => {
          if (subject.quizzes?.length > 0) {
            activity.push({
              type: 'quiz',
              subject: subject.name,
              title: 'Quiz Completed',
              time: '2 hours ago',
              icon: 'quiz'
            });
          }
          if (subject.summaries?.length > 0) {
            activity.push({
              type: 'summary',
              subject: subject.name,
              title: 'Summary Generated',
              time: '1 day ago',
              icon: 'summary'
            });
          }
        });
        setRecentActivity(activity.slice(0, 5));
      }
      
      if (plansData) setStudyPlans(JSON.parse(plansData));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getProgressData = () => {
    const subjectProgress = subjects.map((subject, index) => ({
      name: subject.name.substring(0, 3),
      progress: Math.min((subject.quizzes?.length || 0) * 25, 100),
      color: `rgba(${index * 50}, ${100 + index * 30}, ${150 + index * 20}, 1)`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
    
    return subjectProgress;
  };

  const getQuizPerformanceData = () => {
    const performanceData = {
      labels: subjects.slice(0, 5).map(subject => subject.name.substring(0, 3)),
      datasets: [{
        data: subjects.slice(0, 5).map(subject => {
          const quizzes = subject.quizzes || [];
          return quizzes.length > 0 ? quizzes[quizzes.length - 1].score || 0 : 0;
        })
      }]
    };
    return performanceData;
  };

  const QuickActionCard = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={[styles.quickActionCard, { borderLeftColor: color }]} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={color} />
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <MaterialIcons name={icon} size={24} color="white" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Your learning progress overview</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Subjects"
          value={stats.totalSubjects}
          subtitle="Active"
          icon="menu-book"
          color="#3B82F6"
        />
        <StatCard
          title="Quizzes"
          value={stats.totalQuizzes}
          subtitle="Completed"
          icon="quiz"
          color="#10B981"
        />
        <StatCard
          title="Avg Score"
          value={`${stats.averageScore}%`}
          subtitle="Performance"
          icon="star"
          color="#F59E0B"
        />
        <StatCard
          title="Study Time"
          value={`${stats.totalStudyTime}h`}
          subtitle="This week"
          icon="access-time"
          color="#EF4444"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon="add"
            title="Add Subject"
            subtitle="Create new study material"
            color="#10B981"
            onPress={() => navigation.navigate('StudyPlanner')}
          />
          <QuickActionCard
            icon="quiz"
            title="Take Quiz"
            subtitle="Test your knowledge"
            color="#3B82F6"
            onPress={() => {
              if (subjects.length > 0) {
                navigation.navigate('QuizScreen', { subject: subjects[0] });
              } else {
                Alert.alert('No Subjects', 'Please add a subject first');
              }
            }}
          />
          <QuickActionCard
            icon="summarize"
            title="Generate Summary"
            subtitle="AI-powered notes"
            color="#8B5CF6"
            onPress={() => {
              if (subjects.length > 0) {
                navigation.navigate('SummaryScreen', { subject: subjects[0] });
              } else {
                Alert.alert('No Subjects', 'Please add a subject first');
              }
            }}
          />
          <QuickActionCard
            icon="calendar-today"
            title="Study Plan"
            subtitle="Schedule sessions"
            color="#F59E0B"
            onPress={() => navigation.navigate('StudyPlanner')}
          />
        </View>
      </View>

      {/* Progress Chart */}
      {subjects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Progress</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={getProgressData()}
              width={screenWidth - 40}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="progress"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>
      )}

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: activity.type === 'quiz' ? '#3B82F6' : '#8B5CF6' }
                ]}>
                  <MaterialIcons 
                    name={activity.type === 'quiz' ? 'quiz' : 'summarize'} 
                    size={16} 
                    color="white" 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySubject}>{activity.subject}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="info" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No recent activity</Text>
              <Text style={styles.emptyStateSubtext}>Start by adding subjects and taking quizzes</Text>
            </View>
          )}
        </View>
      </View>

      {/* Upcoming Study Plans */}
      {studyPlans.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Study Plans</Text>
          <View style={styles.studyPlansList}>
            {studyPlans.slice(0, 3).map((plan, index) => (
              <View key={index} style={styles.planItem}>
                <MaterialIcons name="schedule" size={20} color="#6B7280" />
                <View style={styles.planContent}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planTime}>{plan.date} at {plan.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    marginLeft: 12,
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  activitySubject: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  studyPlansList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  planContent: {
    flex: 1,
    marginLeft: 12,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  planTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});