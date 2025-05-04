import { StyleSheet, View, TextStyle, Dimensions } from "react-native";
import { useAppContext } from "@/context/AppContext";
import { finalText } from "./Utils";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Icon from "./Icons";

interface BannerProps {
    item: any;
}

const Banner: React.FC<BannerProps> = ({ item }) => {
    const colorSchema = useColorScheme() ?? 'light';
    const { translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');

    const getBackGroundColor: any = {
        INFO: Colors[colorSchema].bannerInfoBg,
        DEFAULT: Colors[colorSchema].bannerDefaultBg,
    }

    const handleAction = () => {
        if (item?.buttonData?.pathToGo && item?.buttonData?.pathToGo !== "") {
            router.replace(item?.buttonData?.pathToGo);
        }
    };

    return (
        <ThemedView style={[styles.banner, { backgroundColor: getBackGroundColor[item?.bannerType] }]}>
            <Icon type={item?.iconType ?? "info"} fill={item?.bannerType === "DEFAULT" ? "#fff" : "" } />
            <View style={styles.contentContainer}>
                <ThemedText style={[styles.labelText, { color: Colors[colorSchema].bannerInfoText }]}>
                    {finalText(item?.label, translations, selectedLanguage)}
                </ThemedText>
                <View style={styles.rowContainer}>
                    <ThemedText style={[styles.subLabelText, { color: Colors[colorSchema].bannerInfoSubText, width: width * 0.38 }]}>
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
                                textColor={getBackGroundColor[item?.bannerType]}
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
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
    },
    buttonContainer: {
        marginLeft: 16
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
