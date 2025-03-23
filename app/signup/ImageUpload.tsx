import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';
import { uploadFile } from '@/components/Utils';
import ViewImage from '@/components/ViewImage';

interface ImageUploadProps {
}

const ImageUpload: React.FC<ImageUploadProps> = ({ }) => {
    const { signUpDetails, setSignUpDetails } = useAppContext();
    const [loader, setLoader] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<any>("");

    useEffect(() => {
        if(signUpDetails){
            const iUrl = signUpDetails?.imageUrl
            setImageUrl(iUrl);
        }
    },[signUpDetails])

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
            
            handleUploadImage(uriInfo);
          }
        } catch (error) {
          console.log('Error picking image: ', error);
        }
    };

    const handleUploadImage = async (file: any) => {
        setLoader(true);
        const fileName = file?.fileName;
        const phoneNumber = signUpDetails?.phoneOTPDetails?.phoneNumber;
        const uploadedImageUrlObject = await uploadFile(file, fileName, phoneNumber);
        if (uploadedImageUrlObject.status === "SUCCESS"){
            Toast.show({
                type: 'success',  
                text1: 'Image uploaded Successfully.',
                visibilityTime: 3000,
            });
            setImageUrl(uploadedImageUrlObject.data);
            const newSignUpDetails = { ...signUpDetails, imageUrl: uploadedImageUrlObject.data}
            setSignUpDetails(newSignUpDetails);
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: `Something went wrong, error: ${uploadedImageUrlObject.data}`,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
        
    }

    return (
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }} >
            <Text style={{ color: "#32383D", fontSize: 20, lineHeight: 24, fontWeight: 600 }} >
                Let's set up your profile
            </Text>
            <View style={{marginTop: 12, display: 'flex', alignItems: 'center' }} >
                <Text style={{ color: "#32383D", fontSize: 12, lineHeight: 14, fontWeight: 600 }} >Your Profile Picture</Text>
                {imageUrl === "" || imageUrl === null ?
                    <View style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", backgroundColor: "#CFD8DC", borderRadius: 100 }}  />
                :
                    imageUrl && imageUrl !== "" && <Image source={{uri: imageUrl}} resizeMode='cover' height={100} width={100} style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", borderRadius: 100 }} />
                }
                {imageUrl === "" && 
                    <Pressable onPress={pickImage} style={{ borderBottomWidth: 1, borderBottomColor: "#1EA6D6", marginTop: 12}}>
                        <Text style={{ color: "#1EA6D6"}} >
                            Upload Photo
                        </Text>
                    </Pressable>
                }
            </View>
            {loader && <Loader />}
        </View>
    )
}

export default ImageUpload;