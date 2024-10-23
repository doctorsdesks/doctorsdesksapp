import { CardProps } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import IdProofUploadCard from './IdProofUploadCard';
import CustomButton from '@/components/CustomButton';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import storage from '@react-native-firebase/storage';

const UploadCard = () => {
    const { signUpDetails, setSignUpDetails } = useAppContext();
    const { docId, docType } = useLocalSearchParams();

    const [currentData, setCurrentData] = useState<CardProps>();
    const [frontUri, setFrontUri] = useState<any>(null);
    const [backUri, setBackUri] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        if(signUpDetails && docId) {
            const iPD = signUpDetails?.idProofDetails;
            const docToUpload = iPD.find((item: { id: string }) => item?.id === docId);
            setCurrentData(docToUpload);
        }
    }, [signUpDetails, docId])

    const handleChange = (value: string) => {
        currentData && setCurrentData({ ...currentData, value: value })
    }

    const handleUrl = (type: string, url: string) => {
        currentData && setCurrentData({ ...currentData, frontUrl: type === "FRONT" ? url : currentData?.frontUrl, backUrl: type === "BACK" ? url : currentData?.backUrl })
    }

    const handleUploadImage = async () => {
        console.info("uplaod start", frontUri);
        const fileNameFront = frontUri?.fileName;
        const fileNameBack = frontUri?.fileName;
        const frontUrl = await uploadFile(frontUri, fileNameFront);
        const backUrl = await uploadFile(backUri, fileNameBack);
        const iPD = signUpDetails?.idProofDetails;
        const newDocData = iPD?.map((item: {id: string}) => {
            if (item?.id === docId) {
                return { ...item, value: currentData?.value || "", frontUrl: frontUrl || "", backUrl: backUrl || "", isUploaded: true }
            } else {
                return { ...item }
            }
        })
        const newSignUpDetails = { ...signUpDetails, idProofDetails: newDocData}
        setSignUpDetails(newSignUpDetails);
        router.replace({
            pathname: '/signup',
            params: {
                currentStep: "IDP"
            }
        })
    }

    const uploadFile = async (fileUri: any, fileName: string) => {
        setLoader(true);
        const fileExtension = fileUri.uri.split('.').pop();
        console.info("in process 1", fileExtension);
        const storageRef = storage().ref(`uploads/${fileName}`);
        console.info("in process 2", storageRef.fullPath);
        try {
            const task = storageRef.putFile(fileUri.uri);
            task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            });
            await task;
            const downloadUrl = await storageRef.getDownloadURL();
            Toast.show({
                type: 'success',  
                text1: 'Image uploaded Successfully.',
                visibilityTime: 5000,
            });
            return downloadUrl;
        } catch (error) {
            Toast.show({
                type: 'error',  
                text1: 'Something went wrong.',
                visibilityTime: 5000,
            });
            console.log("Error uploading file: ", error);
        } finally {
            setLoader(false);
        }
      };

    return (
        <View style={{ marginTop: 32, marginHorizontal: 16 }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#32383D", lineHeight: 20 }}>
                Please take photos of both the front and back of your registration card
            </Text>
            <View style={{ marginTop: 24 }} >
                {currentData && <IdProofUploadCard data={currentData} docType={docType} onChange={handleChange} handleUrl={handleUrl} frontUri={frontUri} backUri={backUri} setBackUri={setBackUri} setFrontUri={setFrontUri} />}
            </View>
            <CustomButton title='Upload Images' width='FULL' onPress={handleUploadImage} isDisabled={frontUri === null || backUri ===null || currentData?.value === "" ? true : false} containerStyle={{ marginTop: 32 }} />
            {loader && <Loader />}
        </View>
    )
};

export default UploadCard;