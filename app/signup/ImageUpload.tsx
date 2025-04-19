import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';
import ViewImage from '@/components/ViewImage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Path, Svg } from 'react-native-svg';

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
                props: { 
                    style: { width: '80%' },
                    numberOfLines: 2
                }
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
                        <Svg width="38" height="37" viewBox="0 0 38 37" fill="#B5B5B5">
                            <Path d="M37.4459 3.04608V8.32288C37.4459 8.72274 37.2825 9.10621 36.9915 9.38896C36.7005 9.6717 36.3058 9.83054 35.8943 9.83054C35.4828 9.83054 35.0881 9.6717 34.7971 9.38896C34.5062 9.10621 34.3427 8.72274 34.3427 8.32288V3.04608H28.912C28.5005 3.04608 28.1058 2.88724 27.8148 2.60449C27.5239 2.32175 27.3604 1.93828 27.3604 1.53842C27.3604 1.13856 27.5239 0.755085 27.8148 0.472345C28.1058 0.189604 28.5005 0.0307617 28.912 0.0307617H34.3427C35.1657 0.0307617 35.955 0.348446 36.537 0.913927C37.119 1.47941 37.4459 2.24637 37.4459 3.04608ZM35.8943 26.4148C35.4828 26.4148 35.0881 26.5736 34.7971 26.8564C34.5062 27.1391 34.3427 27.5226 34.3427 27.9224V33.1992H28.912C28.5005 33.1992 28.1058 33.3581 27.8148 33.6408C27.5239 33.9236 27.3604 34.307 27.3604 34.7069C27.3604 35.1068 27.5239 35.4902 27.8148 35.773C28.1058 36.0557 28.5005 36.2146 28.912 36.2146H34.3427C35.1657 36.2146 35.955 35.8969 36.537 35.3314C37.119 34.7659 37.4459 33.9989 37.4459 33.1992V27.9224C37.4459 27.5226 37.2825 27.1391 36.9915 26.8564C36.7005 26.5736 36.3058 26.4148 35.8943 26.4148ZM8.74094 33.1992H3.31027V27.9224C3.31027 27.5226 3.1468 27.1391 2.85581 26.8564C2.56483 26.5736 2.17017 26.4148 1.75865 26.4148C1.34714 26.4148 0.952476 26.5736 0.661491 26.8564C0.370505 27.1391 0.207031 27.5226 0.207031 27.9224V33.1992C0.207031 33.9989 0.533979 34.7659 1.11595 35.3314C1.69792 35.8969 2.48724 36.2146 3.31027 36.2146H8.74094C9.15246 36.2146 9.54712 36.0557 9.83811 35.773C10.1291 35.4902 10.2926 35.1068 10.2926 34.7069C10.2926 34.307 10.1291 33.9236 9.83811 33.6408C9.54712 33.3581 9.15246 33.1992 8.74094 33.1992ZM1.75865 9.83054C2.17017 9.83054 2.56483 9.6717 2.85581 9.38896C3.1468 9.10621 3.31027 8.72274 3.31027 8.32288V3.04608H8.74094C9.15246 3.04608 9.54712 2.88724 9.83811 2.60449C10.1291 2.32175 10.2926 1.93828 10.2926 1.53842C10.2926 1.13856 10.1291 0.755085 9.83811 0.472345C9.54712 0.189604 9.15246 0.0307617 8.74094 0.0307617H3.31027C2.48724 0.0307617 1.69792 0.348446 1.11595 0.913927C0.533979 1.47941 0.207031 2.24637 0.207031 3.04608V8.32288C0.207031 8.72274 0.370505 9.10621 0.661491 9.38896C0.952476 9.6717 1.34714 9.83054 1.75865 9.83054ZM13.6092 20.6668C10.8454 21.8404 8.56989 23.8855 7.15053 26.4713C7.02649 26.6997 6.96656 26.9558 6.97677 27.2139C6.98699 27.4719 7.06699 27.7228 7.20872 27.9413C7.34373 28.1647 7.53641 28.35 7.76772 28.4789C7.99902 28.6078 8.26095 28.6759 8.5276 28.6763H29.1254C29.392 28.6759 29.6539 28.6078 29.8852 28.4789C30.1165 28.35 30.3092 28.1647 30.4442 27.9413C30.586 27.7228 30.666 27.4719 30.6762 27.2139C30.6864 26.9558 30.6265 26.6997 30.5024 26.4713C29.0831 23.8855 26.8075 21.8404 24.0438 20.6668C24.8463 19.9662 25.4874 19.1088 25.9253 18.1508C26.3631 17.1927 26.5878 16.1556 26.5846 15.1073C26.5846 13.1081 25.7672 11.1907 24.3123 9.77697C22.8574 8.36326 20.8841 7.56905 18.8265 7.56905C16.7689 7.56905 14.7956 8.36326 13.3407 9.77697C11.8857 11.1907 11.0684 13.1081 11.0684 15.1073C11.0652 16.1556 11.2898 17.1927 11.7277 18.1508C12.1655 19.1088 12.8067 19.9662 13.6092 20.6668Z" fill="#B5B5B5" fill-opacity="0.25"/>
                        </Svg>
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