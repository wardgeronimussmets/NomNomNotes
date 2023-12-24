import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import defaultStyles from '../style.js';

interface RatingListOverviewComponentProps {
  docId: string;
  title: string;
  description: string;
  imageURI: string;
}



const RatingListOverviewComponent: React.FC<RatingListOverviewComponentProps> = ({ docId, title, description, imageURI }) => {
  return (
    <View style={defaultStyles.card_container}>
      <View style={{ flex: 4 }}>
        <Text style={defaultStyles.card_title}>{title}</Text>
        <Text style={defaultStyles.card_description}>{description}</Text>
      </View>
      <View style={{ flex: 2 }}>
        {imageURI ? (
          <Image source={{ uri: imageURI }} style={{ width: 100, height: 100 }}></Image>
        ) : (<></>)}
      </View>
    </View>
  );
};

export default RatingListOverviewComponent;
