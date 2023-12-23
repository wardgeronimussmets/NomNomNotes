import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
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
                            var newIndex = index;
                            components.push(
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('ItemEdit', {
                                            uid: uid,
                                            ratingListRef: ratingListId,
                                            itemIndex: newIndex,
                                            itemComments: item.itemComments,
                                            itemImageURI: item.itemImageURI,
                                            itemName: item.itemName,
                                            itemScore: item.itemScore,
                                            isCreating: false,
                                        });
                                    }}
                                    key={newIndex}
                                >
                                    <RatingItemOverviewComponent
                                        itemId={newIndex.toString()}
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

    const removeList = () => {
        firestore().collection('ratingList').doc(ratingListId)
        .delete()
        .catch((err) => {
            console.error("Couldn't delete the ratingList with id " +ratingListId);
        });
        navigation.goBack();
    }

    const editList = () => {

    }

    useLayoutEffect(() => {
        navigation.setOptions({ 
            headerTitle: ratingListTitle,
            headerRight: () => (
                <View style={styles.headerButtonContainer}>
                    <View style={styles.headerButton}>
                        <Button onPress={editList} title='Edit list'/>
                    </View>
                    <Button onPress={removeList} title='Remove list'/>
                </View>
            ) 
        });
    });

    const createNewItemCallback = () => {
        navigation.navigate('ItemEdit', {
            uid: uid,
            ratingListRef: ratingListId, 
            itemIndex: indexForNewItem,
            itemComments: "",
            itemImageURI: null,
            itemName: "",
            itemScore: "",
            isCreating: true,
        });
}

const styles= StyleSheet.create({
    headerButtonContainer: {
        flexDirection:'row'
    },
    headerButton: {
        paddingHorizontal: 10
    }

});

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

