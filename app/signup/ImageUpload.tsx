import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

interface ImageUploadProps {
    imageUrl: string,
    onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onChange}) => {
    const [image, setImage] = useState<any>();

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Toast.show({
                type: 'error',  
                text1: 'Permission denied, We need camera roll permissions to make this work!',
                visibilityTime: 5000,
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

            
            setImage(uriInfo)
          }
        } catch (error) {
          console.log('Error picking image: ', error);
        }
    };


    return (
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }} >
            <Text style={{ color: "#32383D", fontSize: 20, lineHeight: 24, fontWeight: 600 }} >
                Let's set up your profile
            </Text>
            <View style={{marginTop: 12, display: 'flex', alignItems: 'center' }} >
                <Text style={{ color: "#32383D", fontSize: 12, lineHeight: 14, fontWeight: 600 }} >Your Profile Picture</Text>
                <View style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", backgroundColor: "#CFD8DC", borderRadius: 100 }}  ></View>
                <Pressable onPress={pickImage} style={{ borderBottomWidth: 1, borderBottomColor: "#1EA6D6", marginTop: 12}}>
                    <Text style={{ color: "#1EA6D6"}} >
                        Upload Photo
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ImageUpload;