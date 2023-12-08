import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen';
import ListCreateScreen from './screens/listCreateScreen';
import LoginScreen from './screens/loginScreen';
import React, {useState, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';



const Stack = createNativeStackNavigator();


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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <>
            <Stack.Screen name='Home' component={HomeScreen}/>
            <Stack.Screen name='CreateList' component={ListCreateScreen}/>
          </>
        ) : (
          <>
            <Stack.Screen name='Login' component={LoginScreen}/>
          </>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
