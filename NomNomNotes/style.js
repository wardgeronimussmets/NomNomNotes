import { StyleSheet } from "react-native";

const cardBackgroudColor = '#4dc555';

const defaultStyles = StyleSheet.create({
    card_container: {
        backgroundColor: cardBackgroudColor,
        padding: 20,
        borderRadius: 20,
        margin: 2,
        flexDirection: 'row',
    },
    card_title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    card_description: {
        fontSize: 14,
    },
    headerButtonContainer: {
        flexDirection: 'row'
    },
    leftHeaderButton: {
        paddingHorizontal: 10
    },
    form_container: {
        flex: 1,
        paddingVertical:10,
        paddingHorizontal:20,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    form_title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    form_normal: {
        fontSize: 20,
    },
    form_logo: {
        width: 200,
        height: 200,
        margin: 20,
    },
    form_logo_text_view:{
        position: 'absolute',
        width:'100%',
        height:'100%',
        top: '0%',
        left: '0%',
        justifyContent:'center',
        alignItems:'center'
    },
});

export { cardBackgroudColor };
export default defaultStyles;