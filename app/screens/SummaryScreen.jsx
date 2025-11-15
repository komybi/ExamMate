// app/screens/SummaryScreen.jsx
import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SummaryScreen({ route, navigation }) {
  const { summary, subjectName } = route.params;

  const renderKeyPoints = () => {
    return summary.keyPoints.map((point, index) => (
      <View key={index} style={styles.keyPointItem}>
        <View style={styles.keyPointBullet}>
          <Text style={styles.keyPointNumber}>{index + 1}</Text>
        </View>
        <Text style={styles.keyPointText}>{point}</Text>
      </View>
    ));
  };

  const renderStudyRecommendations = () => {
    return summary.studyRecommendations.map((recommendation, index) => (
      <View key={index} style={styles.recommendationItem}>
        <MaterialIcons name="check-circle" size={20} color="#34C759" />
        <Text style={styles.recommendationText}>{recommendation}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.subjectBadge}>
            <MaterialIcons name="menu-book" size={20} color="white" />
            <Text style={styles.subjectBadgeText}>{subjectName}</Text>
          </View>
          <Text style={styles.summaryTitle}>AI-Generated Study Summary</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.metaText}>{summary.estimatedStudyTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="school" size={16} color="#666" />
              <Text style={styles.metaText}>{summary.difficultyLevel}</Text>
            </View>
          </View>
        </View>

        {/* Main Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="description" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Summary</Text>
          </View>
          <Text style={styles.summaryText}>
            {summary.summary.replace(/\*\*(.*?)\*\*/g, '$1')}
          </Text>
        </View>

        {/* Key Points */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="star" size={20} color="#FF9500" />
            <Text style={styles.sectionTitle}>Key Points</Text>
          </View>
          <View style={styles.keyPointsContainer}>
            {renderKeyPoints()}
          </View>
        </View>

        {/* Priority Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="flag" size={20} color="#FF3B30" />
            <Text style={styles.sectionTitle}>Priority Topics</Text>
          </View>
          <View style={styles.topicsContainer}>
            {summary.priorityTopics.map((topic, index) => (
              <View key={index} style={styles.topicChip}>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Study Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="lightbulb" size={20} color="#34C759" />
            <Text style={styles.sectionTitle}>Study Recommendations</Text>
          </View>
          <View style={styles.recommendationsContainer}>
            {renderStudyRecommendations()}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="download" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Save Summary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  subjectBadge: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  subjectBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  keyPointsContainer: {
    marginTop: 8,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  keyPointBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  keyPointNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  keyPointText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  topicChip: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  topicText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});