import CustomInput2 from '@/components/CustomInput2';
import { CardProps } from '@/constants/Enums';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import ViewImage from '@/components/ViewImage';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { finalText } from '@/components/Utils';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Path, Svg } from 'react-native-svg';

interface IdProofUploadCardProps {
    data: CardProps;
    docType: any;
    onChange: (value: string) => void;
    handleUrl: (type: string, file: any) => void;
    frontUri: any;
    setFrontUri: (value: any) => void;
    setBackUri: (value: any) => void;
    backUri: any;
}

const IdProofUploadCard: React.FC<IdProofUploadCardProps> = ({ data, onChange, handleUrl, backUri, frontUri, setBackUri, setFrontUri }) => {
    const { translations, selectedLanguage } = useAppContext();
    const colorScheme = useColorScheme() || 'light';

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Toast.show({
            type: 'error',  
            text1: 'Permission denied, We need camera roll permissions to make this work!',
            visibilityTime: 3000,
        });
        }
    };

    const pickImage = async (type: string) => {
        // Ask for permission first
        await requestPermission();
    
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
    
          if (!result.canceled) {
            const uriInfo = result.assets[0];
            type === "FRONT" ? setFrontUri(uriInfo) : setBackUri(uriInfo); 
          }
        } catch (error) {
          console.log('Error picking image: ', error);
        }
    };

    return (
        <ThemedView>
            <View
                style={{
                    borderWidth: 1,
                    borderColor: "#F1F1F1",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 20
                }}
            >
                <CustomInput2 
                    data={{
                        id: data?.id,
                        type: "STRING",
                        inputType: "TEXT",
                        value: data?.value,
                        label: data?.label,
                        isMandatory: true,
                        errorMessage: `Please enter valid ${data?.label} number.`,
                        placeholder: `${data?.label} Number`,
                    }} 
                    onChange={onChange}  
                />
            </View>
            <View style={{ marginTop: 20 }}>
                <ThemedText style={{ fontSize: 14, fontWeight: 600, lineHeight: 20 }}>
                    {finalText(`Click & Upload Photos of ${data?.label}`, translations, selectedLanguage)}
                </ThemedText>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }} >
                    <View style={{ height: 160, width: 174, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} >
                        {frontUri && frontUri?.uri !== "" ?
                            <>
                                <ViewImage resizeMode='cover' height={100} width={140} style={{ borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8 }} data={frontUri} />
                                <Pressable style={{ display:'flex', alignItems: 'center' }} onPress={() => pickImage('FRONT')} >
                                    <ThemedText style={{ fontSize: 12, marginTop: 16, lineHeight: 16, fontWeight: 600, color: "#2DB9B0" }}>
                                        Change
                                    </ThemedText>
                                </Pressable>
                            </>
                        :
                            <Pressable style={{ display:'flex', alignItems: 'center' }} onPress={() => pickImage('FRONT')} >
                                <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" >
                                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M9.68874 6.21049C13.8875 5.84585 18.11 5.84585 22.3087 6.21049L24.3221 6.38649C25.2579 6.46844 26.139 6.86277 26.8237 7.50606C27.5083 8.14935 27.9567 9.0042 28.0967 9.93315C28.7015 13.955 28.7015 18.0446 28.0967 22.0665C28.0425 22.4194 27.9483 22.7545 27.8141 23.0718C27.7261 23.2812 27.4541 23.3132 27.2994 23.1452L21.4047 16.6598C21.2744 16.5165 21.1052 16.414 20.9177 16.365C20.7302 16.316 20.5326 16.3226 20.3487 16.3838L16.9741 17.5092L12.0794 12.0025C11.9889 11.9006 11.8785 11.8183 11.755 11.7607C11.6315 11.703 11.4975 11.6712 11.3613 11.6672C11.225 11.6632 11.0894 11.6871 10.9628 11.7375C10.8361 11.7878 10.7211 11.8634 10.6247 11.9598L4.07273 18.5118C4.02822 18.5576 3.97133 18.5893 3.90903 18.6032C3.84673 18.6171 3.78173 18.6125 3.72199 18.59C3.66226 18.5675 3.6104 18.5281 3.57275 18.4765C3.53511 18.425 3.51332 18.3636 3.51007 18.2998C3.35239 15.5045 3.48286 12.7004 3.8994 9.93182C4.03943 9.00287 4.48782 8.14801 5.17246 7.50472C5.8571 6.86144 6.73821 6.46711 7.67407 6.38515L9.68874 6.21049ZM18.6647 11.9998C18.6647 11.4694 18.8754 10.9607 19.2505 10.5856C19.6256 10.2105 20.1343 9.99982 20.6647 9.99982C21.1952 9.99982 21.7039 10.2105 22.0789 10.5856C22.454 10.9607 22.6647 11.4694 22.6647 11.9998C22.6647 12.5303 22.454 13.039 22.0789 13.414C21.7039 13.7891 21.1952 13.9998 20.6647 13.9998C20.1343 13.9998 19.6256 13.7891 19.2505 13.414C18.8754 13.039 18.6647 12.5303 18.6647 11.9998Z" fill="#A9A9AB"/>
                                    <Path d="M3.94801 21.4667C3.912 21.5031 3.88485 21.5472 3.86867 21.5958C3.85248 21.6444 3.8477 21.696 3.85468 21.7467L3.90135 22.0667C4.04137 22.9956 4.48977 23.8505 5.17441 24.4938C5.85905 25.1371 6.74015 25.5314 7.67601 25.6134L9.68935 25.788C13.8893 26.1534 18.1107 26.1534 22.3107 25.788L24.324 25.6134C24.8764 25.5666 25.4137 25.4093 25.904 25.1507C26.0867 25.056 26.1173 24.8147 25.9787 24.6627L20.512 18.6494C20.4686 18.6011 20.412 18.5665 20.3493 18.55C20.2865 18.5334 20.2203 18.5355 20.1587 18.556L16.9827 19.6147C16.797 19.6767 16.5972 19.6828 16.4081 19.6323C16.2189 19.5819 16.0488 19.477 15.9187 19.3307L11.5253 14.388C11.4951 14.3541 11.4582 14.3266 11.417 14.3075C11.3758 14.2883 11.331 14.2777 11.2856 14.2765C11.2401 14.2752 11.1949 14.2833 11.1526 14.3002C11.1104 14.3171 11.0721 14.3424 11.04 14.3747L3.94801 21.4667Z" fill="#A9A9AB"/>
                                </Svg>
                                <ThemedText style={{ marginTop: 8}} >Front Photo</ThemedText>
                                <View style={{ marginTop: 4 }} >
                                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600, color: "#2DB9B0" }}>
                                        Upload
                                    </ThemedText>
                                </View>
                            </Pressable>
                        }
                    </View>
                    <View style={{ height: 160, width: 174, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} >
                        {backUri && backUri?.uri !== "" ?
                            <>
                                <ViewImage resizeMode='cover' height={100} width={140} style={{ borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8 }} data={backUri} />
                                <Pressable style={{ display:'flex', alignItems: 'center' }} onPress={() => pickImage('BACK')} >
                                    <ThemedText style={{ fontSize: 12, marginTop: 16, lineHeight: 16, fontWeight: 600, color: "#2DB9B0" }}>
                                        Change
                                    </ThemedText>
                                </Pressable>
                            </>
                        : 
                            <Pressable style={{ display: 'flex', alignItems: 'center' }} onPress={() => pickImage('BACK')} >
                                <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" >
                                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M9.68874 6.21049C13.8875 5.84585 18.11 5.84585 22.3087 6.21049L24.3221 6.38649C25.2579 6.46844 26.139 6.86277 26.8237 7.50606C27.5083 8.14935 27.9567 9.0042 28.0967 9.93315C28.7015 13.955 28.7015 18.0446 28.0967 22.0665C28.0425 22.4194 27.9483 22.7545 27.8141 23.0718C27.7261 23.2812 27.4541 23.3132 27.2994 23.1452L21.4047 16.6598C21.2744 16.5165 21.1052 16.414 20.9177 16.365C20.7302 16.316 20.5326 16.3226 20.3487 16.3838L16.9741 17.5092L12.0794 12.0025C11.9889 11.9006 11.8785 11.8183 11.755 11.7607C11.6315 11.703 11.4975 11.6712 11.3613 11.6672C11.225 11.6632 11.0894 11.6871 10.9628 11.7375C10.8361 11.7878 10.7211 11.8634 10.6247 11.9598L4.07273 18.5118C4.02822 18.5576 3.97133 18.5893 3.90903 18.6032C3.84673 18.6171 3.78173 18.6125 3.72199 18.59C3.66226 18.5675 3.6104 18.5281 3.57275 18.4765C3.53511 18.425 3.51332 18.3636 3.51007 18.2998C3.35239 15.5045 3.48286 12.7004 3.8994 9.93182C4.03943 9.00287 4.48782 8.14801 5.17246 7.50472C5.8571 6.86144 6.73821 6.46711 7.67407 6.38515L9.68874 6.21049ZM18.6647 11.9998C18.6647 11.4694 18.8754 10.9607 19.2505 10.5856C19.6256 10.2105 20.1343 9.99982 20.6647 9.99982C21.1952 9.99982 21.7039 10.2105 22.0789 10.5856C22.454 10.9607 22.6647 11.4694 22.6647 11.9998C22.6647 12.5303 22.454 13.039 22.0789 13.414C21.7039 13.7891 21.1952 13.9998 20.6647 13.9998C20.1343 13.9998 19.6256 13.7891 19.2505 13.414C18.8754 13.039 18.6647 12.5303 18.6647 11.9998Z" fill="#A9A9AB"/>
                                    <Path d="M3.94801 21.4667C3.912 21.5031 3.88485 21.5472 3.86867 21.5958C3.85248 21.6444 3.8477 21.696 3.85468 21.7467L3.90135 22.0667C4.04137 22.9956 4.48977 23.8505 5.17441 24.4938C5.85905 25.1371 6.74015 25.5314 7.67601 25.6134L9.68935 25.788C13.8893 26.1534 18.1107 26.1534 22.3107 25.788L24.324 25.6134C24.8764 25.5666 25.4137 25.4093 25.904 25.1507C26.0867 25.056 26.1173 24.8147 25.9787 24.6627L20.512 18.6494C20.4686 18.6011 20.412 18.5665 20.3493 18.55C20.2865 18.5334 20.2203 18.5355 20.1587 18.556L16.9827 19.6147C16.797 19.6767 16.5972 19.6828 16.4081 19.6323C16.2189 19.5819 16.0488 19.477 15.9187 19.3307L11.5253 14.388C11.4951 14.3541 11.4582 14.3266 11.417 14.3075C11.3758 14.2883 11.331 14.2777 11.2856 14.2765C11.2401 14.2752 11.1949 14.2833 11.1526 14.3002C11.1104 14.3171 11.0721 14.3424 11.04 14.3747L3.94801 21.4667Z" fill="#A9A9AB"/>
                                </Svg>
                                <ThemedText style={{ marginTop: 8}} >Back Photo</ThemedText>
                                <View style={{ marginTop: 4 }} >
                                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600, color: "#2DB9B0" }}>
                                        Upload
                                    </ThemedText>
                                </View>
                            </Pressable>
                        }
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 20}} >
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center' }}>
                    <ThemedView style={{ height: 4, width: 4, borderRadius: 100, backgroundColor: Colors[colorScheme].dotColor }} />
                    <ThemedText style={{ fontWeight: 400, fontSize: 12, lineHeight: 16, marginLeft: 8 }} >
                        {finalText("Ensure the pictures are clear", translations, selectedLanguage)}
                    </ThemedText>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', marginTop: 6 }}>
                    <ThemedView style={{ height: 4, width: 4, borderRadius: 100, backgroundColor: Colors[colorScheme].dotColor }} />
                    <ThemedText style={{ fontWeight: 400, fontSize: 12, lineHeight: 16, marginLeft: 8 }} >
                        {finalText("Name & number in the picture must match the card number", translations, selectedLanguage)}
                    </ThemedText>
                </View>
            </View>
        </ThemedView>
    );
};

export default IdProofUploadCard;