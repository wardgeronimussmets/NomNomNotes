import { useState } from 'react';
import { Button, SafeAreaView, StatusBar, useColorScheme, Alert } from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const HomeScreen = ({navigation} : any): JSX.Element => {

    const [userLists, setUsersLists] = useState(null);

    const isDarkMode: boolean = useColorScheme() === 'dark';
    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const createNewListCallback = () => {
      navigation.navigate('CreateList');
    }
    return(
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <Button title="Create new list" onPress={createNewListCallback}></Button>
        </SafeAreaView>
    );
}

export default HomeScreen;