import React from "react";
import { View, Text } from "react-native";

interface RatingItemOverviewProps{
    // itemId: string;
    itemName: string;
    itemComments: string;
    itemScore: string;
    itemImageURI: string | null;
}

const RatingItemOverviewComponent:React.FC<RatingItemOverviewProps> = ():JSX.Element => {
    return (
        <View>
            <Text>Item overview</Text>
        </View>
    )
}


export default RatingItemOverviewComponent;
export type {RatingItemOverviewProps};