import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';


const ListCreateScreen = () =>{
    const [listTitle, onChangeListTitle] = useState('');
    const [listDescription, onChangeListDescription] = useState('');
    const [selectedImage, onChangeSelectedImage] = useState<string | null>(null);

    const openImagePicker = () =>{
        const options:ImageLibraryOptions = {
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
                const selectedImageUri = response?.assets?.[0].uri;
                if(selectedImageUri){
                    onChangeSelectedImage(selectedImageUri);
                }
            }
          });
    }

    const storeNewList = () => {
        console.log("storing new list");
    }

    const styles = StyleSheet.create({
        container: {
          flex:1,
          justifyContent:"center",
          alignItems:"center",
        },
        title_text:{
            fontSize:30,
            fontWeight:"bold",
            paddingBottom: 50,
        },
        subtitle_text:{
            fontSize:20,
            fontWeight:"bold",
        },
        normal_text:{
            fontSize:20,
        },
        logo: {
          width: 200,
          height: 200,
        },
        button:{
            fontSize:20,
            padding:5,
        },
      });

    return (
        <View style={styles.container}>
            <Text style={styles.title_text}>Create a new list</Text>
            <Text style={styles.subtitle_text}>List title</Text>
            <TextInput
                onChangeText={onChangeListTitle}
                value={listTitle}
                style={styles.normal_text}
                placeholder='new list name'/>
            <Text style={styles.subtitle_text}>List description</Text>
            <TextInput
                onChangeText={onChangeListDescription}
                value={listDescription}
                style={styles.normal_text}
                placeholder='list description'/>
            <Text style={styles.subtitle_text}>List logo</Text>
            {selectedImage ? (
                <Image
                    style={styles.logo} 
                    source={{uri: selectedImage}}></Image>
            ) : (
                <View style={styles.button}>
                    <Button
                        title='upload list icon'
                        onPress={openImagePicker}/>
                </View>
                
            )}        
                <View style={styles.button}>
                    <Button
                        title="Create new list"
                        onPress={storeNewList}/>
                </View>    

        </View>
    );
}

export default ListCreateScreen;