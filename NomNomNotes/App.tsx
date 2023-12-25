import React, { useEffect, useState } from 'react';
import {
  useColorScheme
} from 'react-native';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './screens/homeScreen';
import ItemEditScreen from './screens/itemEditScreen';
import ListEditScreen from './screens/listEditScreen';
import LoginScreen from './screens/loginScreen';
import RatingDetailScreen, { RatingListDetailProps } from './screens/ratingListDetail';
import defaultStyles, { textColor } from './style';


type RootStackParamlist = {
  Home: { uid: string };
  ListEdit: { uid: string, isCreating: boolean, listTitle: string, listDescription: string, itemImageURI: string | null, ratingListId: string | null };
  ItemEdit: { uid: string, ratingListRef: string, itemIndex: number, itemName: string, itemComments: string, itemImageURI: string | null, itemScore: string, isCreating: boolean };
  RatingListDetail: RatingListDetailProps;
  Login: undefined;
}

function App(): React.JSX.Element {
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
      <RootStack.Navigator
        screenOptions={{
          headerStyle:defaultStyles.navigationHeader,
          headerTitleStyle:defaultStyles.navigationHeaderTitle,
          headerTintColor:textColor
        }}
      >
        {user ? (
          <>
            <RootStack.Screen name='Home' component={HomeScreen} initialParams={{ uid: user.uid }} />
            <RootStack.Screen name='ListEdit' component={ListEditScreen} />
            <RootStack.Screen name='ItemEdit' component={ItemEditScreen} />
            <RootStack.Screen name='RatingListDetail' component={RatingDetailScreen} />
          </>
        ) : (
          <>
            <RootStack.Screen name='Login' component={LoginScreen} />
          </>
        )}

      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
export type { RootStackParamlist };
