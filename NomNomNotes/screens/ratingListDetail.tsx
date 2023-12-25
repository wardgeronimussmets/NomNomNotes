import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import { Button, Text, View, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert } from "react-native";
import { RootStackParamlist } from "../App";
import RatingItemOverviewComponent, { RatingItemOverviewProps } from "../components/ratingItemOverview";
import defaultStyles, { buttonBackgroundColor, isDarkMode } from '../style';
import VectorImage from 'react-native-vector-image';

interface RatingListDetailPropsStructure {
    ratingListId: string;
    ratingListTitle: string;
    ratingListDescription: string;
    ratingListImageURI: string | null;
    uid: string;
}

type RatingListDetailProp = NativeStackScreenProps<RootStackParamlist, 'RatingListDetail'>;


const RatingDetailScreen: React.FC<RatingListDetailProp> = ({ navigation, route }): JSX.Element => {

    const { uid, ratingListId, ratingListTitle, ratingListDescription } = route.params;

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
                        if (ratingItemsData) {
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
        const alertTitle = "Are you sure you want to remove " + ratingListTitle + "?";
        Alert.alert(alertTitle, 'This will permanentely delete the list', [
            {
                text: "Leave me alone I know what I'm doing",
                onPress: () => {
                    firestore().collection('ratingList').doc(ratingListId)
                    .delete()
                    .catch((err) => {
                        console.error("Couldn't delete the ratingList with id " + ratingListId);
                    });
                navigation.goBack();                },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
    }

    const editList = () => {
        navigation.navigate('ListEdit', {
            uid: uid,
            isCreating: false,
            itemImageURI: route.params.ratingListImageURI,
            listDescription: route.params.ratingListDescription,
            listTitle: route.params.ratingListTitle,
            ratingListId: ratingListId
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: ratingListTitle,
            headerRight: () => (
                <View style={defaultStyles.headerButtonContainer}>
                    <View style={defaultStyles.leftHeaderButton}>
                        <TouchableOpacity
                            onPress={editList}
                            style={defaultStyles.navigationHeaderVectorButtonView}
                        >
                            <VectorImage
                                style={defaultStyles.navigationHeaderVectorButton}
                                source={require('../resources/edit.svg')}></VectorImage>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={removeList}
                        style={defaultStyles.navigationHeaderVectorButtonView}
                    >
                        <VectorImage
                            style={defaultStyles.navigationHeaderVectorButton}
                            source={require("../resources/delete.svg")}></VectorImage>
                    </TouchableOpacity>
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

    return (
        <View style={{ ...defaultStyles.app_style, flex: 1 }}>
            {ratingItemComponents.length === 0 ? (
                <View style={{ backgroundColor: 'grey' }}>
                    <Text>No rating items available</Text>
                </View>
            ) : (
                <ScrollView>
                    {ratingItemComponents}
                </ScrollView>
            )}
            <Button color={buttonBackgroundColor} title="Create new item" onPress={createNewItemCallback} />
        </View>

    )
}

export default RatingDetailScreen;
export type { RatingListDetailPropsStructure as RatingListDetailProps };

