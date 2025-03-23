import { CardProps } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import IdProofUploadCard from './IdProofUploadCard';
import CustomButton from '@/components/CustomButton';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { uploadFile } from '@/components/Utils';

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
        setLoader(true);
        const fileNameFront = frontUri?.fileName;
        const fileNameBack = backUri?.fileName;
        const phoneNumber = signUpDetails?.phoneOTPDetails?.phoneNumber;
        const frontUrlObject = await uploadFile(frontUri, fileNameFront, phoneNumber);
        if (frontUrlObject.status === "SUCCESS"){
            const backUrlObject = await uploadFile(backUri, fileNameBack, phoneNumber);
            if(backUrlObject.status === "SUCCESS") {
                const iPD = signUpDetails?.idProofDetails;
                const newDocData = iPD?.map((item: {id: string}) => {
                    if (item?.id === docId) {
                        return { ...item, value: currentData?.value || "", frontUrl: frontUrlObject.data || "", backUrl: backUrlObject.data || "", isUploaded: true }
                    } else {
                        return { ...item }
                    }
                })
                const newSignUpDetails = { ...signUpDetails, idProofDetails: newDocData}
                setSignUpDetails(newSignUpDetails);
                Toast.show({
                    type: 'success',  
                    text1: 'Image uploaded Successfully.',
                    visibilityTime: 3000,
                });
                router.replace({
                    pathname: '/signup',
                    params: {
                        currentStep: "IDP"
                    }
                })
            } else {
                Toast.show({
                    type: 'error',  
                    text1: `Something went wrong, error: ${backUrlObject.data}`,
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        } else {
            Toast.show({
                type: 'error',  
                text1: `Something went wrong, error: ${frontUrlObject.data}`,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

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