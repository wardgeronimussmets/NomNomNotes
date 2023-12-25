import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect, useState } from 'react';
import { Button, Image, ImageBackground, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamlist } from '../App';
import defaultStyles, { buttonBackgroundColor } from '../style';
import { greyImageAsSource } from '../constants';


type ListEditProps = NativeStackScreenProps<RootStackParamlist, 'ListEdit'>;


function getImageURIAsSrc(imageBase64: string, imageType: string): string {
    return 'data:' + imageType + ';base64,' + imageBase64;
}

const ListEditScreen: React.FC<ListEditProps> = ({ navigation, route }) => {
    const [listTitle, onChangeListTitle] = useState(route.params.listTitle);
    const [listDescription, onChangeListDescription] = useState(route.params.listDescription);
    const [selectedImageURIAsSource, onChangeSelectedImageUriAsSource] = useState<string>(route.params.itemImageURI ? route.params.itemImageURI : greyImageAsSource);
    const [selectedImageUri, onChangeSelectedImageUri] = useState<string | null>(null);

    const { uid, isCreating, ratingListId } = route.params;


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
                // else{
                //     console.log("Couldn't store an image because something of the following was undefined:\n"+
                //     "[selectedImageBase64, type, selectedImageUri]" + selectedImageBase64 + type + selectedImageUri);
                // }
            }
        });
    }

    const storeNewList = async() => {
        const newList = {
            name: listTitle,
            description: listDescription,
            imageURI: (selectedImageURIAsSource===greyImageAsSource)?null:selectedImageURIAsSource,
            allowedUsers: [uid],
            ratingItems: []
        };
        if(isCreating){
            firestore()
            .collection('ratingList')
            .add(newList)
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                console.log("storing new list");
            });
        }
        else{
            if(ratingListId){
                const querySnapshot = firestore().collection('ratingList').doc(ratingListId).get();
                newList.ratingItems = (await querySnapshot).data()?.ratingItems;
                if(!newList.ratingItems){
                    newList.ratingItems = [];
                }
                firestore().collection('ratingList').doc(ratingListId).update(newList)
                .catch((err) => {
                    console.error(err);
                });
            }
            else{
                console.error("Cannot store new list if the ratingListId is null");
            }
        }
        navigation.popToTop();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isCreating ? "Create new list" : "Edit existing list"
        });
    });

    return (
        <View style={defaultStyles.form_container}>
            <Text style={defaultStyles.form_title}>List title</Text>
            <TextInput
                onChangeText={onChangeListTitle}
                value={listTitle}
                style={defaultStyles.form_normal}
                placeholder='new list name' />
            <Text style={defaultStyles.form_title}>List description</Text>
            <TextInput
                onChangeText={onChangeListDescription}
                value={listDescription}
                style={defaultStyles.form_normal}
                placeholder='list description' />
            <Text style={defaultStyles.form_title}>List logo</Text>
            <TouchableOpacity
                onPress={openImagePicker}
            >
                <ImageBackground
                    style={defaultStyles.form_logo}
                    source={{ uri: selectedImageURIAsSource }}>
                    {selectedImageURIAsSource === greyImageAsSource ? (
                        <>
                            <View style={defaultStyles.form_logo_text_view}>
                                <Text style={defaultStyles.form_normal}>touch to edit</Text>
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
                    title={isCreating?"Create list":"Edit list"}
                    onPress={storeNewList} />
            </View>

        </View>
    );
}

export default ListEditScreen;