import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import defaultStyles, {cardBackgroudColor} from "../style";

interface RatingItemOverviewProps {
    itemId: string;
    itemName: string;
    itemComments: string;
    itemScore: string;
    itemImageURI: string | null;
}

const RatingItemOverviewComponent: React.FC<RatingItemOverviewProps> = ({ itemId, itemName, itemComments, itemScore, itemImageURI }): JSX.Element => {
    return (
        <View style={defaultStyles.card_container}>
            <Text></Text>
            <View style={{ flex: 3, width:'100%' }}>
                <Text style={defaultStyles.card_title}>{itemName}</Text>
                <Text style={defaultStyles.card_description}>{itemComments}</Text>
                <Text style={defaultStyles.card_description}>{itemScore} / 10</Text>
            </View>
            <View style={{ flex: 1 }}>
                {itemImageURI ? (
                    <Image source={{ uri: itemImageURI }} style={{ width: 100, height: 100 }}></Image>
                ) : (<></>)}
            </View>
        </View>
    );
}

export default RatingItemOverviewComponent;
export type { RatingItemOverviewProps };
