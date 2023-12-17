import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, StatusBar, View, useColorScheme, Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import firestore from '@react-native-firebase/firestore';
import RatingListOverviewComponent from '../components/ratingListOverview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../App';

type HomeScreenProps = NativeStackScreenProps<RootStackParamlist, 'Home'>;

const HomeScreen:React.FC<HomeScreenProps> = ({ navigation, route }): JSX.Element => {
  const isDarkMode: boolean = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const uid = route.params.uid;

  const [ratingListComponents, setRatingListComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchRatingList = async () => {
      try {
        const querySnapshot = await firestore().collection('ratingList').get();
        const components = querySnapshot.docs.map((doc) => (
          <RatingListOverviewComponent
            key={doc.id}
            docId={doc.id}
            title={doc.data().name}
            description={doc.data().description}
            imageURI={doc.data().imageURI}
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
    navigation.navigate('CreateList', {uid:uid});
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {ratingListComponents.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'grey'}}>
          <Text style={{fontSize:20, padding:50}}>No rating lists available</Text>
        </View>
      ):
      (
        <>{ratingListComponents}</>
      )}
      <Button title="Create new list" onPress={createNewListCallback} />
    </SafeAreaView>
  );
};

export default HomeScreen;
