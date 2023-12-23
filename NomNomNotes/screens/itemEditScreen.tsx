import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamlist } from '../App';
import { RatingItemOverviewProps } from '../components/ratingItemOverview';


type ItemEditProp = NativeStackScreenProps<RootStackParamlist, 'ItemEdit'>;

function getImageURIAsSrc(imageBase64: string, imageType: string): string {
    return 'data:' + imageType + ';base64,' + imageBase64;
}

const ItemEditScreen: React.FC<ItemEditProp> = ({ navigation, route }) => {
    const [itemTitle, onChangeItemTitle] = useState('');
    const [itemDescription, onChangeItemDescription] = useState('');
    const [selectedImageURIAsSource, onChangeSelectedImageUriAsSource] = useState<string | null>(null);
    const [selectedImageUri, onChangeSelectedImageUri] = useState<string | null>(null);
    const [itemScore, onChangeItemScore] = useState("");

    const { uid, ratingListRef, itemIndex } = route.params;

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

    const storeNewItem = () => {
        const newItem: RatingItemOverviewProps = {
            itemId: itemIndex.toString(),
            itemName: itemTitle,
            itemComments: itemDescription,
            itemImageURI: selectedImageURIAsSource,
            itemScore: itemScore
        }

        firestore()
            .collection('ratingList').doc(ratingListRef).
            update({
                ratingItems: firestore.FieldValue.arrayUnion(newItem)
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                console.log("storing new item");
            });
        navigation.goBack();
    }

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

    return (
        <View style={styles.container}>
            <Text style={styles.title_text}>Create a new Item</Text>
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
            {selectedImageUri ? (
                <Image
                    style={styles.logo}
                    source={{ uri: selectedImageUri }}></Image>
            ) : (
                <View style={styles.button}>
                    <Button
                        title='upload list icon'
                        onPress={openImagePicker} />
                </View>

            )}
            <View style={styles.button}>
                <Button
                    title="Create new item"
                    onPress={storeNewItem} />
            </View>

        </View>
    );
}

export default ItemEditScreen;