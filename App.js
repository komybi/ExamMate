// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/Login';
import Signup from './app/Signup';
import Home from './app/Home';
import StudyPlannerScreen from './app/screens/StudyPlannerScreen'; // Add this
import QuizScreen from './app/screens/QuizScreen'; // Add this
import SummaryScreen from './app/screens/SummaryScreen'; // Add this

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="StudyPlannerScreen" component={StudyPlannerScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}