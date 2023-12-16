import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import firestore from '@react-native-firebase/firestore';
import RatingListOverviewComponent from '../components/ratingListOverview';

const HomeScreen = ({ navigation }: any): JSX.Element => {
  const isDarkMode: boolean = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [ratingListComponents, setRatingListComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchRatingList = async () => {
      try {
        const querySnapshot = await firestore().collection('ratingList').get();
        const components = querySnapshot.docs.map((doc) => (
          <RatingListOverviewComponent
            docId={doc.id}
            title={doc.data().name}
            description={doc.data().description}
          />
        ));
        setRatingListComponents(components);
      } catch (error) {
        console.error('Error fetching ratingList: ', error);
      }
    };

    fetchRatingList();
  }, []); // Run the effect only once on component mount

  const createNewListCallback = () => {
    navigation.navigate('CreateList');
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {ratingListComponents}
      <Button title="Create new list" onPress={createNewListCallback} />
    </SafeAreaView>
  );
};

export default HomeScreen;
