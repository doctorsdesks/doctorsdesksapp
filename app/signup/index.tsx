import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import SignUpHeader from './SignupHeader';
import CustomInput2 from '@/components/CustomInput2';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
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
import { saveSecureKey } from '@/components/Utils';


const SignUp = () => {
    const { currentStep } = useLocalSearchParams();
    const { signUpHeaderData, setSignUpHeaderData, signUpDetails, setSignUpDetails, setDoctorDetails } = useAppContext();
    const scrollViewRef = React.useRef(null);

    const [step, setStep] = React.useState(currentStep || "PD");

    const [personalDetails, setPersonalDetails] = React.useState<any>([]);
    const [idProofData, setIdProofData] = React.useState<any>([]);
    const [clinicDetails, setClinicDetails] = React.useState<any>([]);
    const [showImage, setShowImage] = React.useState<boolean>(true);
    const [loader, setLoader] = React.useState<boolean>(false);

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
            setSignUpDetails({});
            setSignUpHeaderData([
                {
                    label: "Personal Info",
                    status: "STARTED",
                },
                {
                    label: "Clinic Info",
                    status: "NOT_STARTED",
                },
                {
                    label: "ID Proof",
                    status: "NOT_STARTED",
                }
            ]);
            router.replace("/login");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

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
                if(item?.label === "Personal Details") {
                    return { ...item, status: "COMPLETED"}
                }
                if(item?.label === "Clinic Details") {
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
                if(item?.label === "Clinic Details") {
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
            const getValueById = (object: Array<any>, id: string) => {
                return object?.find((item: {id: string}) => item?.id === id)?.value;
            }
            const phoneOtp = signUpDetails?.phoneOTPDetails;
            const registrationDetails = idProofData?.find((item: {id: string}) => item?.id === "registration");
            const panDetails = idProofData?.find((item: {id: string}) => item?.id === "panCard");
            const aadharDetails = idProofData?.find((item: {id: string}) => item?.id === "aadharCard");
            const updateData = {
                phone: phoneOtp.phoneNumber,
                imageUrl: signUpDetails?.imageUrl,
                name: getValueById(personalDetails, "fullName"),
                gender: getValueById(personalDetails, "gender"),
                email:  getValueById(personalDetails, "email"),
                experience:  getValueById(personalDetails, "experience"),
                specialisation:  getValueById(personalDetails, "specialisation"),
                qualification: getValueById(personalDetails, "qualification"),
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
            console.info("final object to save", updateData);
        }
    }

    const createDoctor = async (updateData: any) => {
        const url = "http://docter-api-service-lb-413222422.ap-south-1.elb.amazonaws.com/v1/signup/doctor";
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'doctorsdesks_web_app',
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                Toast.show({
                    type: 'success',  
                    text1: data.data,
                    visibilityTime: 5000,
                });
            }
            setLoader(false);
            setDoctorDetails(updateData);
            saveSecureKey("isUserOnBoarded", "true");
            saveSecureKey("isUserLoggedIn", "true");
            router.replace("/dashboard");
            console.info("success response", data, status);
        } catch (error: any) {
            if (error?.status === 409) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 5000,
                });
            } else {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 5000,
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
            return clinicDetails.some((item: any) => item.isMandatory && item.value === "");
        } else if (step === "IDP" ) {
            if (idProofData[0]?.isUploaded && (idProofData[1]?.isUploaded || idProofData[2]?.isUploaded) ) return false;
            else return true;
        }
    }

    const handleChangeLanguage = (newValue: string, id: string) => {
        const pDUpdatedData = personalDetails.map((item: any) => {
            if (item.id === id) {
                return { ...item, value: [ ...item?.value, newValue] }; 
            }
            return item;
        });
        setPersonalDetails(pDUpdatedData);
    }

    const handleNameBlue = (value: string) => {
        if(value === ""){
            setShowImage(true);
        }
    };

    const renderInputType = (item: any, detailType: string) => {
        switch (item.inputType) {
            case "TEXT":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id, detailType)} handleFocus={() => setShowImage(false)} handleBlur={handleNameBlue} />
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
            case "SEARCHSELECT":
                return (
                    <SearchSelect data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
            case "BOXES": 
                return (
                    <CustomInputBoxes data={item} onChange={(value, id) => handleChangeLanguage(value, id)} />
                )
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

    return (
        <View style={style.container} >
            <SignUpHeader data={signUpHeaderData} />
            {showImage && step === "PD" && <ImageUpload />}
            <ScrollView
                ref={scrollViewRef}
                style={{ 
                    display: 'flex',
                    backgroundColor: "#F9F9F9",
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
        </View>
    );
}


const style = StyleSheet.create({
    container: {
        backgroundColor: "#FCFCFC",
        paddingHorizontal: 16, 
        paddingTop: 16,
        paddingBottom: 20,
        height: "100%"
    }
});

export default SignUp;
