import { Image, StyleSheet, View, Text, TextStyle } from "react-native";
import { useAppContext } from "@/context/AppContext";
import { finalText } from "./Utils";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Path, Svg } from "react-native-svg";

interface BannerProps {
    item: any;
}

const Banner: React.FC<BannerProps> = ({ item }) => {
    const colorSchema = useColorScheme() ?? 'light';
    const { translations, selectedLanguage } = useAppContext();

    const getBackGroundColor: any = {
        INFO: Colors[colorSchema].bannerInfoBg,
    }

    const getIcon: any = {
        INFO: (
            <Svg width="40" height="40" viewBox="0 0 40 40" fill="none" >
                <Path d="M35.9354 17.8999L33.6854 15.2666C33.2687 14.7666 32.9187 13.8333 32.9187 13.1666V10.3333C32.9187 8.56659 31.4687 7.11659 29.7021 7.11659H26.8687C26.2021 7.11659 25.2521 6.76659 24.7521 6.34993L22.1187 4.09993C20.9687 3.11659 19.0854 3.11659 17.9354 4.09993L15.2687 6.34993C14.7687 6.76659 13.8354 7.11659 13.1687 7.11659H10.2854C8.51875 7.11659 7.06875 8.56659 7.06875 10.3333V13.1666C7.06875 13.8166 6.73542 14.7499 6.31875 15.2499L4.06875 17.8999C3.10208 19.0666 3.10208 20.9333 4.06875 22.0666L6.31875 24.7166C6.73542 25.1999 7.06875 26.1499 7.06875 26.7999V29.6499C7.06875 31.4166 8.51875 32.8666 10.2854 32.8666H13.1854C13.8354 32.8666 14.7854 33.2166 15.2854 33.6333L17.9187 35.8833C19.0687 36.8666 20.9521 36.8666 22.1021 35.8833L24.7354 33.6333C25.2354 33.2166 26.1687 32.8666 26.8354 32.8666H29.6687C31.4354 32.8666 32.8854 31.4166 32.8854 29.6499V26.8166C32.8854 26.1499 33.2354 25.2166 33.6521 24.7166L35.9021 22.0833C36.9187 20.9499 36.9187 19.0666 35.9354 17.8999ZM18.7521 13.5499C18.7521 12.8666 19.3187 12.2999 20.0021 12.2999C20.6854 12.2999 21.2521 12.8666 21.2521 13.5499V21.5999C21.2521 22.2833 20.6854 22.8499 20.0021 22.8499C19.3187 22.8499 18.7521 22.2833 18.7521 21.5999V13.5499ZM20.0021 28.1166C19.0854 28.1166 18.3354 27.3666 18.3354 26.4499C18.3354 25.5333 19.0687 24.7833 20.0021 24.7833C20.9187 24.7833 21.6687 25.5333 21.6687 26.4499C21.6687 27.3666 20.9354 28.1166 20.0021 28.1166Z" fill="#FFF9ED"/>
            </Svg>
        ),
    }

    const handleAction = () => {
        if (item?.buttonData?.pathToGo && item?.buttonData?.pathToGo !== "") {
            router.replace(item?.buttonData?.pathToGo);
        }
    };

    return (
        <ThemedView style={[styles.banner, { backgroundColor: getBackGroundColor[item?.bannerType] }]}>
            {getIcon[item?.bannerType]}
            <View style={styles.contentContainer}>
                <ThemedText style={[styles.labelText, { color: Colors[colorSchema].bannerInfoText }]}>
                    {finalText(item?.label, translations, selectedLanguage)}
                </ThemedText>
                <View style={styles.rowContainer}>
                    <ThemedText style={[styles.subLabelText, { color: Colors[colorSchema].bannerInfoSubText }]}>
                        {finalText(item?.subLabel, translations, selectedLanguage)}
                    </ThemedText>
                    {item?.buttonData && !item?.buttonData?.isHidden && 
                        <View style={styles.buttonContainer}>
                            <CustomButton 
                                containerStyle={{ 
                                    backgroundColor: item?.buttonData?.isDisabled ? "" : "#fff", 
                                    paddingVertical: 7.5, 
                                    paddingHorizontal: 16.5 
                                }} 
                                textColor={Colors[colorSchema].bannerInfoBg}
                                multiLingual={true} 
                                width='FULL' 
                                title={item?.buttonData?.label} 
                                onPress={handleAction} 
                            />
                        </View>
                    }
                </View>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    banner: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20
    },
    image: {
        height: 40,
        width: 40
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    buttonContainer: {
        marginLeft: 4
    },
    labelText: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '700',
        color: "#32383D"
    } as TextStyle,
    subLabelText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '500',
        color: "#32383D",
        marginTop: 10
    } as TextStyle
});

export default Banner;
