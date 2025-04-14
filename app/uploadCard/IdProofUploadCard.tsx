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
                    <View style={{ height: 125, width: 174, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} >
                        {frontUri && frontUri?.uri !== "" ?
                            <ViewImage resizeMode='cover' height={100} width={140} style={{ borderRadius: 8 }} data={frontUri} />
                        :
                            <Pressable style={{ display:'flex', alignItems: 'center' }} onPress={() => pickImage('FRONT')} >
                                <Entypo name="image-inverted" size={32} color="#A9A9AB" />
                                <ThemedText style={{ marginTop: 8}} >Front Photo</ThemedText>
                                <View style={{ marginTop: 4 }} >
                                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600, color: "#2DB9B0" }}>
                                        Upload
                                    </ThemedText>
                                </View>
                            </Pressable>
                        }
                    </View>
                    <View style={{ height: 125, width: 174, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} >
                        {backUri && backUri?.uri !== "" ?
                            <ViewImage resizeMode='cover' height={100} width={140} style={{ borderRadius: 8 }} data={backUri} />
                        : 
                            <Pressable style={{ display: 'flex', alignItems: 'center' }} onPress={() => pickImage('BACK')} >
                                <Entypo name="image-inverted" size={32} color="#A9A9AB" />
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