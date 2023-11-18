/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from './screens/loginScreen';
import ListOverviewScreen from './screens/listOverview';
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

const App = () =>{

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

  const isDarkMode: boolean = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text>Hello senor</Text>
      <View style={styles.fullPage}>
        {user ? <ListOverviewScreen isDarkMode={isDarkMode}/> : <LoginScreen/>}
      </View>
    </SafeAreaView>
  );


}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  fullPage: {
    height: '100%',
    alignItems: 'center'
  }
});

export default App;
