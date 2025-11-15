// app/screens/QuizScreen.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function QuizScreen({ route, navigation }) {
  const { quiz, subjectName } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Prevent re-answering
    
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(newSelectedAnswers);
    
    if (optionIndex === quiz.questions[questionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation(false);
  };

  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Complete</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>🎉</Text>
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.subjectName}>{subjectName}</Text>
            
            <View style={styles.scoreCircle}>
              <Text style={styles.scorePercentage}>{percentage}%</Text>
              <Text style={styles.scoreText}>
                {score} out of {quiz.questions.length} correct
              </Text>
            </View>

            <View style={styles.resultDetails}>
              <View style={styles.detailItem}>
                <MaterialIcons name="timer" size={20} color="#666" />
                <Text style={styles.detailText}>{quiz.estimatedTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="quiz" size={20} color="#666" />
                <Text style={styles.detailText}>{quiz.difficulty} level</Text>
              </View>
            </View>

            <View style={styles.resultButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={restartQuiz}
              >
                <MaterialIcons name="replay" size={20} color="#007AFF" />
                <Text style={styles.secondaryButtonText}>Restart Quiz</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="check" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Back to Subjects</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subjectName} Quiz</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.question}>{question.question}</Text>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrectOption = index === question.correctAnswer;
              const showCorrect = isAnswered && isCorrectOption;
              const showIncorrect = isSelected && !isCorrectOption;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    isSelected && styles.selectedOption,
                    showCorrect && styles.correctOption,
                    showIncorrect && styles.incorrectOption,
                    isAnswered && !isSelected && !showCorrect && styles.disabledOption
                  ]}
                  onPress={() => handleAnswerSelect(currentQuestion, index)}
                  disabled={isAnswered}
                >
                  <View style={styles.optionIndicator}>
                    {showCorrect && <MaterialIcons name="check-circle" size={20} color="#34C759" />}
                    {showIncorrect && <MaterialIcons name="cancel" size={20} color="#FF3B30" />}
                    {!showCorrect && !showIncorrect && (
                      <Text style={styles.optionLetter}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    (showCorrect || showIncorrect) && styles.optionTextRevealed
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation */}
          {isAnswered && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </Text>
              <Text style={styles.explanationText}>
                {question.explanation}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Next Button */}
      {isAnswered && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={nextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
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
    flexGrow: 1,
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e7f3ff',
  },
  correctOption: {
    borderColor: '#34C759',
    backgroundColor: '#e8f8f0',
  },
  incorrectOption: {
    borderColor: '#FF3B30',
    backgroundColor: '#ffeaea',
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  optionTextRevealed: {
    fontWeight: '500',
  },
  explanationContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  resultsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  scoreText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  resultButtons: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});