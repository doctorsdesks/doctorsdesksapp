import React from 'react';
import { Image, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import ViewImage from '@/components/ViewImage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Path, Svg } from 'react-native-svg';
import Icon from '@/components/Icons';

interface ImageUploadProps {
    imageUrl: any;
    setImageUrl: (data: any) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, setImageUrl}) => {

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

    const pickImage = async () => {
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
            setImageUrl({ ...imageUrl, uri: uriInfo, isUploaded: false });
          }
        } catch (error) {
          console.log('Error picking image: ', error);
        }
    };

    return (
        <ThemedView style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }} >
            <ThemedText style={{ fontSize: 20, lineHeight: 24, fontWeight: 600 }} >
                Let's set up your profile
            </ThemedText>
            <View style={{marginTop: 12, display: 'flex', alignItems: 'center' }} >
                <ThemedText style={{ fontSize: 12, lineHeight: 14, fontWeight: 600 }} >Your Profile Picture</ThemedText>
                { imageUrl && imageUrl?.uri !== "" ? 
                    (imageUrl?.isUploaded ? 
                            <Image source={{uri: imageUrl?.uri}} resizeMode='cover' height={100} width={100} style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", borderRadius: 100 }} />
                        :
                            <ViewImage resizeMode='cover' height={100} width={100} style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", borderRadius: 100 }} data={imageUrl?.uri} />
                    )
                :  
                    <View style={{ marginTop: 8, height: 100, width: 100, borderColor: "#F1F1F1", backgroundColor: "#F1F1F1", borderRadius: 100, display: "flex", alignItems: 'center', justifyContent: 'center' }} >
                        <Icon type='imageAlt' />
                    </View>
                } 
                <Pressable onPress={pickImage} style={{ borderBottomWidth: 1, borderBottomColor: "#1EA6D6", marginTop: 12}}>
                    <ThemedText style={{ color: "#1EA6D6"}} >
                        {imageUrl && imageUrl?.uri !== "" ? "Change" : "Upload Photo"}
                    </ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    )
}

export default ImageUpload;