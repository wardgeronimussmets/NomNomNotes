import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import VectorImage from 'react-native-vector-image';

interface RatingListOverviewComponentProps {
    docId: string;
    title: string;
    description: string;
    imageURI:string;
}

const RatingListOverviewComponent: React.FC<RatingListOverviewComponentProps> = ({ docId, title, description, imageURI }) => {
  return (
      <View style={styles.box}>
        <View style={{flex:4}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={{flex:2}}>
          <Image source={{uri:imageURI}}></Image>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection:'row'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'red',
  },
});

export default RatingListOverviewComponent;