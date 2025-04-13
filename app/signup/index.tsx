import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, BackHandler, Keyboard } from 'react-native';
import SignUpHeader from './SignupHeader';
import CustomInput2 from '@/components/CustomInput2';
import CustomButton from '@/components/CustomButton';
import CustomRadio from '@/components/CustomRadio';
import IdProof from './IdProof';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import CustomInputBoxes from '@/components/CustomInputBoxes';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import SearchSelect from '@/components/SearchSelect';
import { getConfig, getValueById, login, saveSecureKey } from '@/components/Utils';
import { signUpDetailsInitial, signUpHeaderDataInitial } from '@/context/InitialState';
import { ThemedView } from '@/components/ThemedView';
import { CONFIGS } from '@/constants/Enums';


const SignUp = () => {
    const { currentStep } = useLocalSearchParams();
    const { signUpHeaderData, setSignUpHeaderData, signUpDetails, setSignUpDetails, setDoctorDetails } = useAppContext();
    const scrollViewRef = React.useRef(null);

    const [step, setStep] = React.useState(currentStep || "PD");

    const [personalDetails, setPersonalDetails] = React.useState<any>([]);
    const [idProofData, setIdProofData] = React.useState<any>([]);
    const [clinicDetails, setClinicDetails] = React.useState<any>([]);
    const [showImage, setShowImage] = React.useState<boolean>(true);
    const [isKeyboardOpen, setIsKeyboardOpen] = React.useState<boolean>(false);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [specialisationOptions, setSpecialisationOptions] = React.useState<any>([]);

    useEffect(() => {
        if(signUpDetails){
            const pD = signUpDetails?.personalDetails;
            const cD = signUpDetails?.clinicDetails;
            const iPD = signUpDetails?.idProofDetails;
            setPersonalDetails(pD);
            setClinicDetails(cD);
            setIdProofData(iPD);
        }
    }, [signUpDetails]);

    useEffect(() => {
        const backAction = () => {
            if (isKeyboardOpen) {
                Keyboard.dismiss();
                return true;
            } else {
                setSignUpDetails(signUpDetailsInitial);
                setSignUpHeaderData(signUpHeaderDataInitial);
                router.replace("/login");
                return true;
            }
        };

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
            { setIsKeyboardOpen(true); setShowImage(false)}
          );
          const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
           { setIsKeyboardOpen(false); setShowImage(true)}
          );

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        getSpecialisation();

        return () => backHandler.remove();
    }, []);

    const getSpecialisation = async () => {
        const response = await getConfig(CONFIGS.SPECIALISATION);

        if (response?.status === "SUCCESS") {
            const specialisation = response?.data?.data || [];
            let finalSpec = specialisation?.map((item: any) => Object.keys(item)[0]);
            finalSpec.sort((a: string, b: string) => a.localeCompare(b)); // Sort alphabetically
            setSpecialisationOptions(finalSpec);
        }
    }

    const handleChange = (value: string, id: string, detailType: string) => {
        if (detailType === "PD") {
            const pDUpdatedData = personalDetails.map((item: any) => {
                if (item.id === id) {
                    return { ...item, value }; 
                }
                return item;
            });
            setPersonalDetails(pDUpdatedData);
        } else if (detailType === "CD") {
            const cDUpdatedData = clinicDetails.map((item: any) => {
                if (item.id === id) {
                    return { ...item, value }; 
                }
                return item;
            });
            setClinicDetails(cDUpdatedData);
        }
        
    }

    const handleButtonClick = () => {
        if(step === "PD") {
            setStep("CD");
            const updatedHeaderDataPD = signUpHeaderData?.map((item) => {
                if(item?.label === "Personal Info") {
                    return { ...item, status: "COMPLETED"}
                }
                if(item?.label === "Clinic Info") {
                    return { ...item, status: "STARTED"}
                }
                return { ...item };
            })
            setSignUpHeaderData(updatedHeaderDataPD);
            const newSignUpDetails = { ...signUpDetails, personalDetails: personalDetails}
            setSignUpDetails(newSignUpDetails);
            if (scrollViewRef.current) {
                (scrollViewRef.current as any).scrollTo({ x: 0, y: 0, animated: true });
            }
        } else if(step === "CD"){
            setStep("IDP");
            const updatedHeaderDataCD = signUpHeaderData?.map((item) => {
                if(item?.label === "Clinic Info") {
                    return { ...item, status: "COMPLETED"}
                }
                if(item?.label === "ID Proof") {
                    return { ...item, status: "STARTED"}
                }
                return { ...item };
            })
            setSignUpHeaderData(updatedHeaderDataCD);
            const newSignUpDetails = { ...signUpDetails, clinicDetails: clinicDetails}
            setSignUpDetails(newSignUpDetails);
            if (scrollViewRef.current) {
                (scrollViewRef.current as any).scrollTo({ x: 0, y: 0, animated: true });
            }
        } else if(step === "IDP"){
            setLoader(true);
            // const phoneOtp = signUpDetails?.phoneOTPDetails;
            const numPassInfo = signUpDetails?.loginDetails;
            const registrationDetails = idProofData?.find((item: {id: string}) => item?.id === "registration");
            const panDetails = idProofData?.find((item: {id: string}) => item?.id === "panCard");
            const aadharDetails = idProofData?.find((item: {id: string}) => item?.id === "aadharCard");
            const updateData = {
                phone: getValueById(numPassInfo, "number"),
                imageUrl: signUpDetails?.imageUrl,
                password: getValueById(numPassInfo, "password"),
                name: getValueById(personalDetails, "fullName"),
                gender: getValueById(personalDetails, "gender"),
                email:  getValueById(personalDetails, "email"),
                dob: getValueById(personalDetails, "dob"),
                experience:  getValueById(personalDetails, "experience"),
                graduation: getValueById(personalDetails, "graduation"),
                graduationCollege: getValueById(personalDetails, "graduationCollege"),
                graduationYear: getValueById(personalDetails, "graduationYear"),
                specialisation:  getValueById(personalDetails, "specialisation"),
                specialisationCollege: getValueById(personalDetails, "specialisationCollege"),
                specialisationYear: getValueById(personalDetails, "specialisationYear"),
                otherQualification: getValueById(personalDetails, "otherQualification"),
                languages: getValueById(personalDetails, "languages"),
                clinicAddress: {
                    clinicName: getValueById(clinicDetails, "clinicName"),
                    address: {
                        addressLine: getValueById(clinicDetails, "clinicAddress"),
                        landmark: getValueById(clinicDetails, "landmark"),
                        city: getValueById(clinicDetails, "city"),
                        state: getValueById(clinicDetails, "state"),
                        pincode: getValueById(clinicDetails, "pincode"),
                    }
                },
                registrationInfo: {
                    number: registrationDetails.value,
                    frontUrl: registrationDetails.frontUrl,
                    backUrl: registrationDetails.backUrl,
                },
                panInfo: {
                    number: panDetails.value,
                    frontUrl: panDetails.frontUrl,
                    backUrl: panDetails.backUrl,
                },
                aadharInfo: {
                    number: aadharDetails.value,
                    frontUrl: aadharDetails.frontUrl,
                    backUrl: aadharDetails.backUrl
                }
            }
            createDoctor(updateData);
        }
    }

    const createDoctor = async (updateData: any) => {
        const url = "http://docter-api-service-lb-413222422.ap-south-1.elb.amazonaws.com/v1/signup/doctor";
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'nirvaanhealth_web_app',
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                // login user
                const payload = {
                    phone: data?.data?.phone,
                    password: updateData?.password,
                    type: "DOCTOR"
                }
                const loginResponse = await login(payload);
                if (loginResponse?.status === "SUCCESS") {
                    setDoctorDetails(data?.data);
                    setSignUpDetails(signUpDetailsInitial);
                    saveSecureKey("isUserOnBoarded", "true");
                    saveSecureKey("userAuthtoken", loginResponse?.data?.user?.authToken);
                    router.replace("/successSignUp");
                    setLoader(false);
                } else {
                    router.replace({
                        pathname: "/successSignUp",
                        params: {
                            isLoggedFailed: "true",
                        }
                    })
                    setLoader(false);
                }
            } else {
                Toast.show({
                    type: 'error',  
                    text1: "Something wrong. Please try again.",
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        } catch (error: any) {
            if (error?.status === 409) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 3000,
                });
            } else {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 3000,
                });
            }
            setLoader(false);
        }
    }

    const handleDisable = () => {
        if (step === "PD") {
            if( personalDetails?.some((item: any) => item.isMandatory && item.value === "")) return true;
            if (personalDetails?.find((item: any) => item?.id === "languages")?.value?.length === 0) return true;
            const emailValue = personalDetails?.find((item: any) => item.id === "email")?.value;

            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue)) return true;
        } else if (step === "CD") {
            if (clinicDetails.some((item: any) => item.isMandatory && item.value === "")) return true;
            if (clinicDetails?.find((item: any) => item?.id === "pincode")?.value?.length !== 6) return true;
        } else if (step === "IDP" ) {
            if (idProofData[0]?.isUploaded && (idProofData[1]?.isUploaded || idProofData[2]?.isUploaded) ) return false;
            else return true;
        }
    }

    const handleChangeLanguage = (newValue: string, id: string, type: string) => {
        let pDUpdatedData = [...personalDetails];
        if(type === "ADD"){
            pDUpdatedData = pDUpdatedData.map((item: any) => {
                if (item.id === id) {
                    return { ...item, value: [ ...item?.value, newValue] }; 
                }
                return item;
            });
        } else if(type === "REMOVE"){
            pDUpdatedData = pDUpdatedData.map((item: any) => {
                if (item.id === id) {
                    const newValues = [...item.value];
                    const index = newValues.findIndex((language: string) => language === newValue);
                    if(index !== -1) {
                        newValues.splice(index, 1);
                    }
                    return { ...item, value: [ ...newValues] }; 
                }
                return item;
            });
        }
        setPersonalDetails(pDUpdatedData);
    }

    const renderInputType = (item: any, detailType: string) => {
        switch (item.inputType) {
            case "TEXT":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            case "NUMBER":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            case "PHONE":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            case "EMAIL":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            case "RADIO":
                return (
                    <CustomRadio data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            case "SEARCHSELECT": {
                    let finalItem = { ...item };
                    finalItem.options = specialisationOptions;
                    return (
                        <SearchSelect data={finalItem} onChange={(value, id) => handleChange(value, id, detailType)} />
                    )
                }
                break;
            case "BOXES": 
                return (
                    <CustomInputBoxes data={item} onChange={(value, id, type) => handleChangeLanguage(value, id, type)} />
                )
                break;
            case "DATE":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            default:
                break;
        }
    }

    const renderValue = () => {
        switch (step) {
            case "PD":
                return (personalDetails?.map((item: any) => {
                            return (
                                <View key={item?.id} style={{ marginBottom: 16 }} >
                                    {renderInputType(item, "PD")}
                                </View>
                            )
                        }))
                break;
            case "CD":
                return (clinicDetails?.map((item: any) => {
                    return (
                        <View key={item?.id} style={{ marginBottom: 16, paddingBottom: 16 }} >
                            {renderInputType(item, "CD")}
                        </View>
                    )
                }))
                break;
            case "IDP":
                return (
                    <IdProof idProofData={idProofData} />
                );
                break;
            default:
                break;
        }
    }

    return (loader ? <Loader /> 
        :
            <ThemedView style={style.container} >
                <SignUpHeader data={signUpHeaderData} />
                {showImage && step === "PD" && <ImageUpload />}
                <ScrollView
                    ref={scrollViewRef}
                    style={{ 
                        display: 'flex',
                        borderRadius: 8,
                        borderColor: "#DDDDDD",
                        marginTop: 16,
                        borderWidth: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 16,
                    }}
                >
                    {renderValue()}
                </ScrollView>
                <View style={{ display: "flex", alignItems: "center", marginTop: 24 }} >
                    <CustomButton width='FULL' title="Continue" onPress={handleButtonClick} isDisabled={handleDisable()} />
                </View>
            </ThemedView>
    );
}


const style = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        paddingTop: 16,
        paddingBottom: 20,
        height: "100%"
    }
});

export default SignUp;
