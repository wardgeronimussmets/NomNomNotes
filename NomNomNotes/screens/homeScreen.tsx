import {View, Text} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = (userData: any): JSX.Element => {

    const isDarkMode: boolean = userData.isDarkMode;
    const user: FirebaseAuthTypes.User = userData.user;

    //console.log(firestore().collection("userList").get());  
    console.log("user: " + user);
    const userListReference = firestore().collection('users').doc(user.uid)
        .get()
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    console.log(userListReference);

   

    //const ratingListIds: string[] = firestore().collection("userList");

    return(
        <Text>Home</Text>

    );
}

export default HomeScreen;