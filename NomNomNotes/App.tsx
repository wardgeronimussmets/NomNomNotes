/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen';
import ListCreateScreen from './screens/listCreateScreen';
import LoginScreen from './screens/loginScreen';
import ItemCreateScreen from './screens/itemCreateScreen';
import RatingDetailScreen, {RatingListDetailProps} from './screens/ratingListDetail';


type RootStackParamlist = {
  Home: {uid:string};
  CreateList: {uid: string};
  ItemCreate: {uid: string};
  RatingListDetail: RatingListDetailProps;
  Login: undefined;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    // Auth listener
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      authUser ? setUser(authUser) : setUser(null);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  const RootStack = createNativeStackNavigator<RootStackParamlist>();

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {user ? (
          <>
            <RootStack.Screen name='Home' component={HomeScreen} initialParams={{uid: user.uid}}/>
            <RootStack.Screen name='CreateList' component={ListCreateScreen}/>
            <RootStack.Screen name='ItemCreate' component={ItemCreateScreen}/>
            <RootStack.Screen name='RatingListDetail' component={RatingDetailScreen}/>
          </>
        ) : (
          <>
            <RootStack.Screen name='Login' component={LoginScreen}/>
          </>
        )}
        
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
export type {RootStackParamlist};