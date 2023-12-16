import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

interface RatingListOverviewComponentProps {
    docId: string;
    title: string;
    description: string;
}

const RatingListOverviewComponent: React.FC<RatingListOverviewComponentProps> = ({ docId, title, description }) => {
    console.log({title});
    return (
        <View style={styles.box}>
            <Text>{docId}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
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
