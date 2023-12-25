import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamlist } from '../App';
import RatingListOverviewComponent from '../components/ratingListOverview';
import defaultStyles, {isDarkMode, appBackgroundColor, buttonBackgroundColor} from '../style';

type HomeScreenProps = NativeStackScreenProps<RootStackParamlist, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }): JSX.Element => {

  const { uid } = route.params;

  const [ratingListComponents, setRatingListComponents] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


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
        setLoading(false);
      };

      fetchRatingList();
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
          color={buttonBackgroundColor}
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
    <SafeAreaView style={{...defaultStyles.app_style, flex:1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={appBackgroundColor}
      />
      {loading ? (
        <ActivityIndicator size="large"></ActivityIndicator>
      ):(
        <>
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
        </>
      )
      }


      <Button title="Create new list" color={buttonBackgroundColor} onPress={createNewListCallback} />
    </SafeAreaView>
  );
};

export default HomeScreen;
