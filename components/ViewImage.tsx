import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';

interface ImageProps {
    data: any;
    height: number;
    width: number;
    style: any;
    resizeMode: any;
}

const ViewImage: React.FC<ImageProps> = ({ data, height, width, style, resizeMode }) => {
    const [imageSource, setImageSource] = useState<any>();

    useEffect(() => {
        const changeUri = async (uri: any) => {
            if (uri && uri.startsWith('file://')) {
                try {
                    // Copy the image to a cache directory for easier access
                    const fileUri = await FileSystem.getInfoAsync(uri);
                    // Check if file exists
                    if (fileUri.exists) {
                        setImageSource(fileUri);
                    } else {
                        Toast.show({
                            type: 'error',  
                            text1: "File doesn't exist at the given URI.",
                            visibilityTime: 3000,
                            props: { 
                                style: { width: '80%' },
                                numberOfLines: 2
                            }
                        });
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',  
                        text1: `Error accessing the file: ${error}`,
                        visibilityTime: 3000,
                        props: { 
                            style: { width: '80%' },
                            numberOfLines: 2
                        }
                    });
                }
            } else {
                setImageSource(uri);
            }
        }
        if (data) {
            const uri = data?.uri;
            changeUri(uri);
        }
    },[data])
    if (imageSource && imageSource !== "") {
        return (
            <Image source={imageSource} resizeMode={resizeMode} height={height} width={width} style={style} />
        )
    } else {
        return null;
    }
};

export default ViewImage;