import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface RatingItemOverviewProps {
    itemId: string;
    itemName: string;
    itemComments: string;
    itemScore: string;
    itemImageURI: string | null;
}

const RatingItemOverviewComponent: React.FC<RatingItemOverviewProps> = ({ itemId, itemName, itemComments, itemScore, itemImageURI }): JSX.Element => {

    return (
        <View style={styles.box}>
            <View style={{ flex: 3 }}>
                <Text>{itemName}</Text>
                <Text>{itemComments}</Text>
                <Text>{itemScore} / 10</Text>
            </View>
            <View style={{ flex: 1 }}>
                {itemImageURI ? (
                    <Image source={{ uri: itemImageURI }} style={{ width: 100, height: 100 }}></Image>
                ) : (<></>)}
            </View>
        </View>


    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'lightgreen',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        flexDirection: 'row'
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


export default RatingItemOverviewComponent;
export type { RatingItemOverviewProps };
