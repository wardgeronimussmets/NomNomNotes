import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
// import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';


const ListCreateScreen = () =>{
    const [listTitle, onChangeListTitle] = useState('');
    const [listDescription, onChangeListDescription] = useState('');
    const [selectedImage, onChangeSelectedImage] = useState<string | null>(null);

    // const openImagePicker = () =>{
    //     const options:ImageLibraryOptions = {
    //         mediaType: 'photo',
    //         includeBase64: true,
    //         maxHeight: 2000,
    //         maxWidth: 2000,
    //       };
      
    //       launchImageLibrary(options, (response) => {
    //         if (response.didCancel) {
    //           console.log('User cancelled image picker');
    //         } else if (response.errorCode) {
    //           console.log('Image picker error: ', response.errorMessage);
    //         } else {
    //             const selectedImageUri = response?.assets?.[0].uri;
    //             if(selectedImageUri){
    //                 onChangeListDescription(selectedImageUri);
    //             }
    //         }
    //       });
    // }

    return (
        <View>
            <Text>Create a new list</Text>
            <Text>List title</Text>
            <TextInput
                onChangeText={onChangeListTitle}
                value={listTitle}
                placeholder='new list name'/>
            <Text>List description</Text>
            <TextInput
                onChangeText={onChangeListDescription}
                value={listDescription}
                placeholder='list description'/>
            <Text>List logo</Text>
            {/* <Button
                title='upload list icon'
                onPress={openImagePicker}/>
            selectedImage &&
            <Text>Image was set</Text> */}
            <Button
                title="Create new list"/>
        </View>
    );
   
}

export default ListCreateScreen;