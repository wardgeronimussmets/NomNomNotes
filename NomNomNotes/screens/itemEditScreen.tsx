import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamlist } from '../App';
import { RatingItemOverviewProps } from '../components/ratingItemOverview';
import defaultStyles, { buttonBackgroundColor, formPlaceholderColor, normalFontSize } from '../style';
import { greyImageAsSource } from '../constants';
import VectorImage from 'react-native-vector-image';


type ItemEditProp = NativeStackScreenProps<RootStackParamlist, 'ItemEdit'>;

function getImageURIAsSrc(imageBase64: string, imageType: string): string {
    return 'data:' + imageType + ';base64,' + imageBase64;
}

const ItemEditScreen: React.FC<ItemEditProp> = ({ navigation, route }) => {
    const [itemTitle, onChangeItemTitle] = useState(route.params.itemName);
    const [itemDescription, onChangeItemDescription] = useState(route.params.itemComments);
    const [selectedImageURIAsSource, onChangeSelectedImageUriAsSource] = useState<string>(route.params.itemImageURI ? route.params.itemImageURI : greyImageAsSource);
    const [selectedImageUri, onChangeSelectedImageUri] = useState<string | null>(null);
    const [itemScore, onChangeItemScore] = useState(route.params.itemScore);

    const { uid, ratingListRef, itemIndex, isCreating } = route.params;

    const openImagePicker = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('Image picker error: ', response.errorMessage);
            } else {
                const selectedImageBase64 = response?.assets?.[0].base64;
                const type = response?.assets?.[0].type;
                const selectedImageUri = response?.assets?.[0].uri;

                if (selectedImageBase64 && type && selectedImageUri) {
                    onChangeSelectedImageUriAsSource(getImageURIAsSrc(selectedImageBase64, type));
                    onChangeSelectedImageUri(selectedImageUri);
                }
                else {
                    console.log("Couldn't store an image because something of the following was undefined:\n" +
                        "[selectedImageBase64, type, selectedImageUri]" + selectedImageBase64 + type + selectedImageUri);
                }
            }
        });
    }

    const scoreIsValid = ():boolean => {
        if(!itemScore){
            return false;
        }
        try{
            const numb = Number(itemScore);
            if(numb > 10 || numb < 0){
                return false;
            }
            return true;
        }
        catch{
            return false;
        }
    }

    const storeNewItem = async () => {
        if(scoreIsValid()){
            const newItem: RatingItemOverviewProps = {
                itemId: itemIndex.toString(),
                itemName: itemTitle,
                itemComments: itemDescription,
                itemImageURI: (selectedImageURIAsSource === greyImageAsSource) ? null : selectedImageURIAsSource,
                itemScore: itemScore
            }
    
            if (isCreating) {
                firestore()
                    .collection('ratingList').doc(ratingListRef).
                    update({
                        ratingItems: firestore.FieldValue.arrayUnion(newItem)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else {
                const doc = await firestore().collection('ratingList').doc(ratingListRef).get();
                const currentArray: RatingItemOverviewProps[] = doc.data()?.ratingItems;
                if (!currentArray) {
                    console.log("Couldn't get ratingItems for the given doc " + ratingListRef);
                }
                else if (!currentArray[itemIndex]) {
                    console.log("no item in ratingItem array for index " + itemIndex + " the array has length=" + currentArray.length);
                }
                else {
                    currentArray[itemIndex].itemId = itemIndex.toString();
                    currentArray[itemIndex].itemName = itemTitle;
                    currentArray[itemIndex].itemComments = itemDescription;
                    currentArray[itemIndex].itemImageURI = (selectedImageURIAsSource === greyImageAsSource) ? null : selectedImageURIAsSource;
                    currentArray[itemIndex].itemScore = itemScore;
    
                    await firestore().collection('ratingList').doc(ratingListRef).update({
                        ratingItems: currentArray
                    })
                        .catch((err) => {
                            console.log(err);
                        });
                }
    
            }
            navigation.goBack();
        }
        else{
            Alert.alert('Invalid score', 'The score should be a value between 0 and 10');
        }
        
    }

    const startRemoveItem = () => {
        const alertTitle = "Are you sure you want to remove " + itemTitle + "?";
        Alert.alert(alertTitle, 'This will permanentely delete the item', [
            {
                text: "Leave me alone I know what I'm doing",
                onPress: () => {
                    removeItem();
                },
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    }

    const removeItem = async () => {

        const doc = await firestore().collection('ratingList').doc(ratingListRef).get();
        const currentArray: RatingItemOverviewProps[] = doc.data()?.ratingItems;
        if (!currentArray) {
            console.log("Couldn't get ratingItems for the given doc " + ratingListRef);
        }
        else if (!currentArray[itemIndex]) {
            console.log("no item in ratingItem array for index " + itemIndex + " the array has length=" + currentArray.length);
        }
        else {
            currentArray.splice(itemIndex, 1);

            await firestore().collection('ratingList').doc(ratingListRef).update({
                ratingItems: currentArray
            })
                .catch((err) => {
                    console.log(err);
                });
        }
        navigation.goBack();


    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isCreating ? "Create new item" : "Edit existing item",
            headerRight: () => (
                !isCreating && (
                    <TouchableOpacity
                        onPress={startRemoveItem}
                        style={defaultStyles.navigationHeaderVectorButtonView}
                    >
                        <VectorImage
                            style={defaultStyles.navigationHeaderVectorButton}
                            source={require("../resources/delete.svg")}></VectorImage>
                    </TouchableOpacity>
                )
            ),
        });
    });

    return (
        <View style={defaultStyles.form_container}>
            <Text style={defaultStyles.form_title}>Item title</Text>
            <TextInput
                onChangeText={onChangeItemTitle}
                value={itemTitle}
                style={defaultStyles.form_normal}
                placeholder='new item name'
                placeholderTextColor={formPlaceholderColor} />

            <Text style={defaultStyles.form_title}>Item score</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    onChangeText={onChangeItemScore}
                    value={itemScore}
                    keyboardType='numeric'
                    style={defaultStyles.form_normal}
                    placeholder='item score'
                    placeholderTextColor={formPlaceholderColor}
                />
                <Text style={{ fontSize: normalFontSize, paddingLeft: 5 }}> / 10</Text>
            </View>


            <Text style={defaultStyles.form_title}>Item comments</Text>
            <TextInput
                onChangeText={onChangeItemDescription}
                value={itemDescription}
                style={defaultStyles.form_normal}
                placeholder='item comments'
                placeholderTextColor={formPlaceholderColor} />


            <Text style={defaultStyles.form_title}>Item image</Text>

            <TouchableOpacity
                onPress={openImagePicker}
            >
                <ImageBackground
                    style={defaultStyles.form_logo}
                    source={{ uri: selectedImageURIAsSource }}>
                    {selectedImageURIAsSource === greyImageAsSource ? (
                        <>
                            <View style={defaultStyles.form_logo_text_view}>
                                <Text style={{ fontSize: normalFontSize, color: 'black' }}>touch to edit</Text>
                            </View>
                        </>
                    ) : (
                        <></>
                    )}

                </ImageBackground>
            </TouchableOpacity>
            <View>
                <Button
                    color={buttonBackgroundColor}
                    title={isCreating ? "Create item" : "Edit item"}
                    onPress={storeNewItem} />
            </View>

        </View>
    );
}

export default ItemEditScreen;