import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Animated,
  Alert,
  StatusBar,
  Dimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FlashcardsScreen({ route, navigation }) {
  // Validate route params with fallbacks
  const { flashcards, subjectName = 'Study' } = route.params || {};
  const cards = flashcards?.cards || [];
  
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Update progress animation when card changes
  useEffect(() => {
    if (cards.length > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentCard + 1) / cards.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentCard, cards.length]);

  // Handle empty flashcards
  useEffect(() => {
    if (cards.length === 0) {
      Alert.alert(
        'No Flashcards',
        'There are no flashcards available for this subject.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [cards.length]);

  const nextCard = () => {
    if (cards.length === 0) return;
    
    setShowAnswer(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    if (cards.length === 0) return;
    
    setShowAnswer(false);
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const flipCard = () => {
    if (cards.length === 0 || isFlipping) return;
    
    setIsFlipping(true);
    
    Animated.timing(flipAnim, {
      toValue: showAnswer ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    });
  };

  const resetStudySession = () => {
    Alert.alert(
      'Reset Session',
      'Start over from the first card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setCurrentCard(0);
            setShowAnswer(false);
            flipAnim.setValue(0);
          }
        }
      ]
    );
  };

  // Front interpolation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Back interpolation
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  // Progress bar width interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{subjectName}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="error-outline" size={64} color="#6c757d" />
          <Text style={styles.emptyStateText}>No flashcards available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCardData = cards[currentCard];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {subjectName}
        </Text>
        <TouchableOpacity onPress={resetStudySession} style={styles.resetButton}>
          <MaterialIcons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[styles.progressFill, { width: progressWidth }]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentCard + 1} / {cards.length}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Card Container */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.cardTouchable} 
            onPress={flipCard}
            activeOpacity={0.9}
            disabled={isFlipping}
          >
            {/* Front of Card */}
            <Animated.View 
              style={[
                styles.card, 
                styles.cardFront, 
                frontAnimatedStyle
              ]}
            >
              <Text style={styles.cardText}>
                {currentCardData.front}
              </Text>
              <Text style={styles.tapHint}>
                👆 Tap to flip
              </Text>
            </Animated.View>

            {/* Back of Card */}
            <Animated.View 
              style={[
                styles.card, 
                styles.cardBack, 
                backAnimatedStyle
              ]}
            >
              <Text style={styles.cardText}>
                {currentCardData.back}
              </Text>
              <Text style={styles.tapHint}>
                👆 Tap to flip
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.controlButton, currentCard === 0 && styles.controlButtonDisabled]} 
            onPress={prevCard}
            disabled={currentCard === 0}
          >
            <MaterialIcons name="navigate-before" size={24} color={currentCard === 0 ? "#ccc" : "#007AFF"} />
            <Text style={[styles.controlText, currentCard === 0 && styles.controlTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={flipCard}
            disabled={isFlipping}
          >
            <MaterialIcons name="cached" size={24} color="#007AFF" />
            <Text style={styles.controlText}>
              {showAnswer ? 'Show Question' : 'Show Answer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={nextCard}
          >
            <Text style={styles.controlText}>Next</Text>
            <MaterialIcons name="navigate-next" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Recommendation */}
        {flashcards.recommendedUse && (
          <View style={styles.recommendationContainer}>
            <MaterialIcons name="lightbulb-outline" size={16} color="#6c757d" />
            <Text style={styles.recommendation}>
              {flashcards.recommendedUse}
            </Text>
          </View>
        )}
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  resetButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    perspective: 1000,
  },
  cardTouchable: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.5,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#ffffff',
  },
  cardBack: {
    backgroundColor: '#f8f9fa',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 28,
  },
  tapHint: {
    position: 'absolute',
    bottom: 16,
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 32,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minWidth: 100,
    justifyContent: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginHorizontal: 4,
  },
  controlTextDisabled: {
    color: '#ccc',
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  recommendation: {
    fontSize: 14,
    color: '#0066cc',
    marginLeft: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
    textAlign: 'center',
  },
});