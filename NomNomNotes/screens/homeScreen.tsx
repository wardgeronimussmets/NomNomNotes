import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StatusBar, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RootStackParamlist } from '../App';
import RatingListOverviewComponent from '../components/ratingListOverview';

type HomeScreenProps = NativeStackScreenProps<RootStackParamlist, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }): JSX.Element => {
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
          <TouchableOpacity onPress={() => {
            navigation.navigate("RatingListDetail", {
              ratingListId: doc.id,
              ratingListTitle: doc.data().name,
              ratingListDescription: doc.data().description,
              uid: uid
            });
          }}
            key={doc.id}>
            <RatingListOverviewComponent
              docId={doc.id}
              title={doc.data().name}
              description={doc.data().description}
              imageURI={doc.data().imageURI}
            />
          </TouchableOpacity>

        ));
        setRatingListComponents(components);
      } catch (error) {
        console.error('Error fetching ratingList: ', error);
      }
    };

    fetchRatingList();
  }, []); // Run the effect only once on component mount

  const createNewListCallback = () => {
    navigation.navigate('CreateList', { uid: uid });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {ratingListComponents.length === 0 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey' }}>
          <Text style={{ fontSize: 20, padding: 50 }}>No rating lists available</Text>
        </View>
      ) :
        (
          <>{ratingListComponents}</>
        )}
      <Button title="Create new list" onPress={createNewListCallback} />
    </SafeAreaView>
  );
};

export default HomeScreen;
