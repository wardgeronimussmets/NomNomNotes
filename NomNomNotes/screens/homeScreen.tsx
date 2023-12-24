import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RootStackParamlist } from '../App';
import RatingListOverviewComponent from '../components/ratingListOverview';
import auth from '@react-native-firebase/auth';

type HomeScreenProps = NativeStackScreenProps<RootStackParamlist, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }): JSX.Element => {
  const isDarkMode: boolean = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const { uid } = route.params;

  const [ratingListComponents, setRatingListComponents] = useState<JSX.Element[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchRatingList = async () => {
        try {
          const querySnapshot = await firestore().collection('ratingList').where('allowedUsers','array-contains',uid).get();
          const components = querySnapshot.docs.map((doc) => (
            <TouchableOpacity onPress={() => {
              navigation.navigate("RatingListDetail", {
                ratingListId: doc.id,
                ratingListTitle: doc.data().name,
                ratingListDescription: doc.data().description,
                uid: uid,
                ratingListImageURI: doc.data().imageURI
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
      return () => {
        // Cleanup function
      };
    }, [])
  );

  const createNewListCallback = () => {
    navigation.navigate('ListEdit', {
      uid: uid,
      isCreating: true,
      itemImageURI: null,
      listDescription: "",
      listTitle: "",
      ratingListId: null
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title='Logout'
          onPress={() => {
            auth().signOut()
              .catch((err) => {
                console.error(err);
              });
          }}
        />
      )
    })
  });

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
          <ScrollView>
            {ratingListComponents}
          </ScrollView>
        )}
      <Button title="Create new list" onPress={createNewListCallback} />
    </SafeAreaView>
  );
};

export default HomeScreen;
