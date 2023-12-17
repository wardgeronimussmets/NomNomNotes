import React, { useEffect, useState } from "react"
import { Text, View, Button } from "react-native"
import firestore from '@react-native-firebase/firestore';
import RatingItemOverviewComponent, {RatingItemOverviewProps} from "../components/ratingItemOverview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../App";

interface RatingListDetailPropsStructure{
    navigation: any;
    ratingListId: string;
    ratingListTitle:string;
    ratingListDescription:string;
    uid:string;
}

type RatingListDetailProp = NativeStackScreenProps<RootStackParamlist, 'RatingListDetail'>;


const RatingDetailScreen:React.FC<RatingListDetailProp> = ({navigation, route}): JSX.Element => {
    const ratingListId = route.params.ratingListId;
    const ratingListTitle = route.params.ratingListTitle;
    const ratingListDescription = route.params.ratingListDescription;
    const uid = route.params.uid;
    

    const [ratingItemComponents, setRatingItemComponents] = useState<JSX.Element[]>([]);


    
    useEffect(() => {
        const fetchRatingItems = async () => {
          try {
            const querySnapshot = await firestore().collection('ratingList').doc(ratingListId).get();
            const data = querySnapshot.data();
            
            if (data) {
              const ratingItemsData = data.ratingItems as RatingItemOverviewProps[];
              var components: JSX.Element[] = []; 
              ratingItemsData.forEach(item => {
                components.push(
                    <RatingItemOverviewComponent
                        itemId={item.itemId}
                        itemName={item.itemName}
                        itemComments={item.itemComments}
                        itemImageURI={item.itemImageURI}
                        itemScore={item.itemScore}
                    />
                )
              });
              setRatingItemComponents(components);
            }
          } catch (error) {
            console.error('Error fetching rating items:', error);
          }
        };
        fetchRatingItems();
    });

    const createNewItemCallback = () => {
        navigation.navigate('ItemCreate', {uid:uid});
    }


    return (
        <View>
            <View>
                <Text>{ratingListTitle}</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'grey'}}>
                {ratingItemComponents.length === 0 ? (
                    <Text>No rating items available</Text>
                ) : (
                    <>{ratingItemComponents}</>
                )}
            </View>
            <Button title="Create new item" onPress={createNewItemCallback} />
        </View>
    )
}

export default RatingDetailScreen;
export type {RatingListDetailPropsStructure as RatingListDetailProps};