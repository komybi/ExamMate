// app/screens/ProgressScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

export default function ProgressScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const subjectsData = await AsyncStorage.getItem('subjects');
      if (subjectsData) {
        setSubjects(JSON.parse(subjectsData));
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStats = () => {
    const totalQuizzes = subjects.reduce((sum, subject) => 
      sum + (subject.quizzes?.length || 0), 0
    );
    
    const completedQuizzes = subjects.flatMap(subject => 
      subject.quizzes?.filter(quiz => quiz.completed) || []
    );
    
    const averageScore = completedQuizzes.length > 0 
      ? completedQuizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / completedQuizzes.length 
      : 0;

    const totalStudyTime = subjects.length * 2; // Mock data

    return {
      totalSubjects: subjects.length,
      totalQuizzes,
      completedQuizzes: completedQuizzes.length,
      averageScore: Math.round(averageScore),
      totalStudyTime
    };
  };

  const getSubjectProgressData = () => {
    return subjects.map((subject, index) => ({
      name: subject.name,
      quizzes: subject.quizzes?.length || 0,
      completed: subject.quizzes?.filter(q => q.completed).length || 0,
      averageScore: subject.quizzes?.filter(q => q.completed).length > 0 
        ? Math.round(subject.quizzes.filter(q => q.completed).reduce((sum, q) => sum + (q.score || 0), 0) / subject.quizzes.filter(q => q.completed).length)
        : 0,
      color: `rgba(${index * 50}, ${100 + index * 30}, ${150 + index * 20}, 1)`
    }));
  };

  const getPerformanceChartData = () => {
    const last7Quizzes = subjects
      .flatMap(subject => subject.quizzes || [])
      .filter(quiz => quiz.completed)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 7)
      .reverse();

    return {
      labels: last7Quizzes.map((_, index) => `Q${index + 1}`),
      datasets: [{
        data: last7Quizzes.map(quiz => quiz.score || 0),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const getTimeDistributionData = () => {
    const distribution = subjects.map((subject, index) => ({
      name: subject.name.substring(0, 3),
      hours: (subject.quizzes?.length || 0) * 0.5, // Mock data
      color: `rgba(${index * 50}, ${100 + index * 30}, ${150 + index * 20}, 1)`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
    
    return distribution;
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <MaterialIcons name={icon} size={20} color={color} />
        <Text style={[styles.changeText, { color: change >= 0 ? '#10B981' : '#EF4444' }]}>
          {change >= 0 ? '+' : ''}{change}%
        </Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const ProgressBar = ({ label, progress, color }) => (
    <View style={styles.progressItem}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressPercent}>{progress}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Progress Data...</Text>
      </View>
    );
  }

  const stats = getOverallStats();
  const subjectProgress = getSubjectProgressData();
  const performanceData = getPerformanceChartData();
  const timeDistribution = getTimeDistributionData();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Progress</Text>
        <Text style={styles.headerSubtitle}>Track your study journey</Text>
      </View>

      {/* Time Frame Selector */}
      <View style={styles.timeFrameSelector}>
        {['week', 'month', 'all'].map(timeFrame => (
          <TouchableOpacity
            key={timeFrame}
            style={[
              styles.timeFrameButton,
              selectedTimeFrame === timeFrame && styles.timeFrameButtonActive
            ]}
            onPress={() => setSelectedTimeFrame(timeFrame)}
          >
            <Text style={[
              styles.timeFrameText,
              selectedTimeFrame === timeFrame && styles.timeFrameTextActive
            ]}>
              {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['overview', 'subjects', 'performance'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'overview' && (
        <>
          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Subjects"
              value={stats.totalSubjects}
              change={12}
              icon="menu-book"
              color="#3B82F6"
            />
            <StatCard
              title="Quizzes Taken"
              value={stats.completedQuizzes}
              change={8}
              icon="quiz"
              color="#10B981"
            />
            <StatCard
              title="Avg Score"
              value={`${stats.averageScore}%`}
              change={5}
              icon="star"
              color="#F59E0B"
            />
            <StatCard
              title="Study Hours"
              value={stats.totalStudyTime}
              change={15}
              icon="access-time"
              color="#EF4444"
            />
          </View>

          {/* Performance Chart */}
          {performanceData.datasets[0].data.length > 0 && (
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Recent Performance</Text>
              <View style={styles.chartContainer}>
                <LineChart
                  data={performanceData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#3B82F6'
                    }
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
            </View>
          )}

          {/* Time Distribution */}
          {timeDistribution.length > 0 && (
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Study Time Distribution</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={timeDistribution}
                  width={screenWidth - 40}
                  height={180}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="hours"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </View>
          )}
        </>
      )}

      {activeTab === 'subjects' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Progress</Text>
          <View style={styles.subjectsList}>
            {subjectProgress.map((subject, index) => (
              <View key={index} style={styles.subjectProgressCard}>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectScore}>{subject.averageScore}%</Text>
                </View>
                <View style={styles.progressStats}>
                  <View style={styles.progressStat}>
                    <MaterialIcons name="quiz" size={16} color="#6B7280" />
                    <Text style={styles.progressStatText}>
                      {subject.completed}/{subject.quizzes} quizzes
                    </Text>
                  </View>
                </View>
                <ProgressBar
                  label="Completion"
                  progress={subject.quizzes > 0 ? Math.round((subject.completed / subject.quizzes) * 100) : 0}
                  color={subject.color}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTab === 'performance' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Performance</Text>
          
          {/* Strengths & Weaknesses */}
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>📈 Strengths</Text>
            <View style={styles.strengthList}>
              {subjectProgress
                .filter(subject => subject.averageScore >= 80)
                .slice(0, 3)
                .map((subject, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <MaterialIcons name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.strengthText}>{subject.name}</Text>
                    <Text style={styles.strengthScore}>{subject.averageScore}%</Text>
                  </View>
                ))
              }
            </View>
          </View>

          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>📉 Areas to Improve</Text>
            <View style={styles.strengthList}>
              {subjectProgress
                .filter(subject => subject.averageScore < 70 && subject.averageScore > 0)
                .slice(0, 3)
                .map((subject, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <MaterialIcons name="warning" size={16} color="#F59E0B" />
                    <Text style={styles.strengthText}>{subject.name}</Text>
                    <Text style={styles.improvementScore}>{subject.averageScore}%</Text>
                  </View>
                ))
              }
            </View>
          </View>

          {/* Study Recommendations */}
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>💡 Study Recommendations</Text>
            <View style={styles.recommendationList}>
              <View style={styles.recommendationItem}>
                <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
                <Text style={styles.recommendationText}>
                  Focus on your weakest subjects with targeted practice
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
                <Text style={styles.recommendationText}>
                  Review quiz explanations to understand mistakes
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
                <Text style={styles.recommendationText}>
                  Create study plans for consistent learning
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Empty State */}
      {subjects.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialIcons name="analytics" size={64} color="#9CA3AF" />
          <Text style={styles.emptyStateTitle}>No Progress Data</Text>
          <Text style={styles.emptyStateText}>
            Start by adding subjects and taking quizzes to track your progress
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('StudyPlanner')}
          >
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Add Subjects</Text>
          </TouchableOpacity>
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
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeFrameButtonActive: {
    backgroundColor: '#2563EB',
  },
  timeFrameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeFrameTextActive: {
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
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
  chartSection: {
    marginBottom: 24,
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
  chart: {
    borderRadius: 16,
  },
  subjectsList: {
    gap: 12,
  },
  subjectProgressCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subjectScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressStats: {
    marginBottom: 12,
  },
  progressStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStatText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  progressItem: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  performanceCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  strengthList: {
    gap: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  strengthText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
  },
  strengthScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  improvementScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  recommendationCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 12,
  },
  recommendationList: {
    gap: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#0C4A6E',
    marginLeft: 8,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});