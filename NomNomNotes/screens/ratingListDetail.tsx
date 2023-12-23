import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import { Button, Text, View, TouchableOpacity } from "react-native";
import { RootStackParamlist } from "../App";
import RatingItemOverviewComponent, { RatingItemOverviewProps } from "../components/ratingItemOverview";

interface RatingListDetailPropsStructure {
    ratingListId: string;
    ratingListTitle: string;
    ratingListDescription: string;
    uid: string;
}

type RatingListDetailProp = NativeStackScreenProps<RootStackParamlist, 'RatingListDetail'>;


const RatingDetailScreen: React.FC<RatingListDetailProp> = ({ navigation, route }): JSX.Element => {
    const ratingListId = route.params.ratingListId;
    const ratingListTitle = route.params.ratingListTitle;
    const ratingListDescription = route.params.ratingListDescription;
    const uid = route.params.uid;

    const [ratingItemComponents, setRatingItemComponents] = useState<JSX.Element[]>([]);
    const [indexForNewItem, setIndexForNewItem] = useState<number>(-1);


    useFocusEffect(
        React.useCallback(() => {
            const fetchRatingItems = async () => {
                try {
                    const querySnapshot = await firestore().collection('ratingList').doc(ratingListId).get();
                    const data = querySnapshot.data();

                    if (data) {
                        const ratingItemsData = data.ratingItems as RatingItemOverviewProps[];
                        var components: JSX.Element[] = [];
                        var index = 0;
                        ratingItemsData.forEach(item => {
                            components.push(
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('ItemEdit', {
                                            uid: uid,
                                            ratingListRef: ratingListId,
                                            itemIndex: index
                                        });
                                    }}
                                    key={index}
                                >
                                    <RatingItemOverviewComponent
                                        itemId={index.toString()}
                                        itemName={item.itemName}
                                        itemComments={item.itemComments}
                                        itemImageURI={item.itemImageURI}
                                        itemScore={item.itemScore}
                                    />

                                </TouchableOpacity>
                            );
                            index++;
                        });
                        setRatingItemComponents(components);
                        setIndexForNewItem(index);
                    }
                } catch (error) {
                    console.error('Error fetching rating items:', error);
                }
            };
            fetchRatingItems();
            return () => {
                // Cleanup function
            };
        }, [])
    );

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: ratingListTitle });
    });

    const createNewItemCallback = () => {
        navigation.navigate('ItemEdit', { uid: uid, ratingListRef: ratingListId, itemIndex: indexForNewItem });
    }


    return (
        <View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {ratingItemComponents.length === 0 ? (
                    <View style={{ backgroundColor: 'grey' }}>
                        <Text>No rating items available</Text>
                    </View>
                ) : (
                    <>{ratingItemComponents}</>
                )}
            </View>
            <Button title="Create new item" onPress={createNewItemCallback} />
        </View>
    )
}

export default RatingDetailScreen;
export type { RatingListDetailPropsStructure as RatingListDetailProps };

