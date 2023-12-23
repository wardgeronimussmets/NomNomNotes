import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamlist } from '../App';
import { RatingItemOverviewProps } from '../components/ratingItemOverview';


type ItemEditProp = NativeStackScreenProps<RootStackParamlist, 'ItemEdit'>;

function getImageURIAsSrc(imageBase64: string, imageType: string): string {
    return 'data:' + imageType + ';base64,' + imageBase64;
}

const ItemEditScreen: React.FC<ItemEditProp> = ({ navigation, route }) => {
    const [itemTitle, onChangeItemTitle] = useState(route.params.itemName);
    const [itemDescription, onChangeItemDescription] = useState(route.params.itemComments);
    const [selectedImageURIAsSource, onChangeSelectedImageUriAsSource] = useState<string | null>(route.params.itemImageURI);
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

    const storeNewItem = async () => {
        const newItem: RatingItemOverviewProps = {
            itemId: itemIndex.toString(),
            itemName: itemTitle,
            itemComments: itemDescription,
            itemImageURI: selectedImageURIAsSource,
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
                currentArray[itemIndex].itemImageURI = selectedImageURIAsSource;
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
            headerTitle: itemTitle,
            headerRight: () => (
                !isCreating && (
                    <Button
                    onPress={removeItem}
                    title="Remove Item"
                />
                )
            ),
        });
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        title_text: {
            fontSize: 30,
            fontWeight: "bold",
            paddingBottom: 50,
        },
        subtitle_text: {
            fontSize: 20,
            fontWeight: "bold",
        },
        normal_text: {
            fontSize: 20,
        },
        logo: {
            width: 200,
            height: 200,
        },
        button: {
            fontSize: 20,
            padding: 5,
        },
    });

    const storeButtonTitle = isCreating ? "Create item" : "Edit item";

    return (
        <View style={styles.container}>
            {isCreating ? (
                <Text style={styles.title_text}>Create a new Item</Text>

            ) : (
                <Text style={styles.title_text}>Edit an existing Item</Text>
            )}
            <Text style={styles.subtitle_text}>Item title</Text>
            <TextInput
                onChangeText={onChangeItemTitle}
                value={itemTitle}
                style={styles.normal_text}
                placeholder='new list name' />
            <Text style={styles.subtitle_text}>Item score</Text>
            <TextInput
                onChangeText={onChangeItemScore}
                value={itemScore}
                keyboardType='numeric'
                style={styles.normal_text}
                placeholder='item score' />
            <Text style={styles.subtitle_text}>Item comments</Text>
            <TextInput
                onChangeText={onChangeItemDescription}
                value={itemDescription}
                style={styles.normal_text}
                placeholder='list description' />


            <Text style={styles.subtitle_text}>Item image</Text>
            {selectedImageURIAsSource ? (
                <TouchableOpacity
                    onPress={openImagePicker}
                >
                    <Image
                        style={styles.logo}
                        source={{ uri: selectedImageURIAsSource }}></Image>
                </TouchableOpacity>
            ) : (
                <View style={styles.button}>
                    <Button
                        title='upload list icon'
                        onPress={openImagePicker} />
                </View>

            )}

            <View style={styles.button}>
                <Button
                    title={storeButtonTitle}
                    onPress={storeNewItem} />
            </View>

        </View>
    );
}

export default ItemEditScreen;