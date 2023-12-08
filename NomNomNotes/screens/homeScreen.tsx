import {View, Text, Button, SafeAreaView, useColorScheme, StatusBar} from 'react-native';
import {useState, useEffect} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';

import LoginScreen from './loginScreen';

const HomeScreen = (): JSX.Element => {

    const [userLists, setUsersLists] = useState(null);

    const userUid = auth().currentUser?.uid;

    const isDarkMode: boolean = useColorScheme() === 'dark';
    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };


    const createNewUserDoc = (userUid: string) =>{
        firestore().collection(DatabaseReferences.USERS)
        .doc(userUid)
        .set({
            lists: []
        })
        .then(() => {
            console.log('User added!');
            
        });
    }

    const getUserLists = () =>{
        var userListDoc = firestore().collection(DatabaseReferences.USERS).doc(userUid)
        .get()
        .catch((error) => {
            if(error.code == Exceptions.PERMISSION_DENIED){
                {userUid ? createNewUserDoc(userUid) : null}
            }
            else{
                console.log("Error getting documents: ", error);
            }
        });
        console.log(userListDoc);
    }

    const createNewListCallback = () => {
      console.log("Callback button clicked");
    }
    return(
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <Button title="Create new list" onPress={() => {createNewListCallback}}></Button>
        </SafeAreaView>
    );
}

export default HomeScreen;