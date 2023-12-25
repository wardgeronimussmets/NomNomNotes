import { StyleSheet, Appearance } from "react-native";

const isDarkMode = Appearance.getColorScheme() === 'dark';

const cardBackgroudColor = isDarkMode?'#235726':'#58e061';
const appBackgroundColor = isDarkMode?'black':'white';
const buttonBackgroundColor = isDarkMode?'#155e99':'#2296f3';
const textColor = isDarkMode?'white':'black';

const defaultStyles = StyleSheet.create({
    app_style:{
        backgroundColor: appBackgroundColor,
    },
    navigationHeader:{
      backgroundColor:isDarkMode?'#2b2b2b':'white',  
    },
    navigationHeaderTitle:{
        color: textColor
    },
    navigationHeaderVectorButtonView:{
        backgroundColor: buttonBackgroundColor,
        padding:5,
    },
    navigationHeaderVectorButton:{
        width:40,
        height:40
    },
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
        backgroundColor: appBackgroundColor,
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

export { cardBackgroudColor, isDarkMode, appBackgroundColor, buttonBackgroundColor, textColor };
export default defaultStyles;