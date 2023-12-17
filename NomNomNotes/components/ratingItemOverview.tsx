import React from "react";
import { View } from "react-native";

interface RatingItemOverviewProps{
    itemId: string;
    itemName: string;
    itemComments: string;
    itemScore: number;
    itemImageURI: string;
}

const RatingItemOverviewComponent:React.FC<RatingItemOverviewProps> = ():JSX.Element => {
    return (
        <View>

        </View>
    )
}


export default RatingItemOverviewComponent;
export type {RatingItemOverviewProps};