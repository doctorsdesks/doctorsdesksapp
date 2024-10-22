import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SignUpHeader from './SignupHeader';
import CustomInput2 from '@/components/CustomInput2';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import CustomRadio from '@/components/CustomRadio';


const SignUp = () => {
    const scrollViewRef = React.useRef(null);
    const [ headerData, setHeaderData ] = React.useState([
        {
            label: "Personal Details",
            status: "STARTED",
        },
        {
            label: "Clinic Details",
            status: "NOT_STARTED",
        },
        {
            label: "ID Proof",
            status: "NOT_STARTED",
        }
    ]);

    const [step, setStep] = React.useState("PD");

    const [personalDetails, setPersonalDetails] = React.useState([
        {
            id: "fullName",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "Full Name",
            isMandatory: true,
            errorMessage: "Please provide your full name.",
            placeholder: "Enter your full name",
        },
        {
            id: "gender",
            type: "STRING",
            inputType: "RADIO",
            value: "",
            label: "Gender",
            isMandatory: true,
            errorMessage: "Please select your gender",
            options: ["MALE", "FEMALE", "OTHER"],
        },
        {
            id: "experience",
            type: "STRING",
            inputType: "NUMBER",
            value: "",
            label: "Experience (in years)",
            isMandatory: true,
            errorMessage: "Please provide your experience",
            placeholder: "Enter your experience in years",
        },
        {
            id: "specialisation",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "Specialisation",
            isMandatory: true,
            errorMessage: "Please provide your specialisation",
            placeholder: "Enter your specialisation",
        },
        {
            id: "qualification",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "Qualification",
            isMandatory: true,
            errorMessage: "Please provide your qualification",
            placeholder: "Enter your qualification",
        },
    ]);

    const [clinicDetails, setClinicDetails] = React.useState([
        {
            id: "clinicName",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "Clinic Name",
            isMandatory: true,
            errorMessage: "Please enter your clinic name",
            placeholder: "Clinic Name",
        },
        {
            id: "clinicAddress",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "Clinic Address",
            isMandatory: true,
            errorMessage: "Please enter your clinic address",
            placeholder: "12, Street Name",
        },
        {
            id: "landmark",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "Landmark",
            isMandatory: false,
            errorMessage: "",
            placeholder: "Near Ganesh Temple",
        },
        {
            id: "city",
            type: "STRING",
            inputType: "TEXT",
            value: "",
            label: "City",
            isMandatory: true,
            errorMessage: "Please enter your city",
            placeholder: "Ambala",
        },
        {
            id: "pincode",
            type: "STRING",
            inputType: "NUMBER",
            value: "",
            label: "Pincode",
            isMandatory: true,
            errorMessage: "Please enter your pincode",
            placeholder: "133001",
        },
    ]);

    const handleChange = (value: string, id: string, detailType: string) => {
        if (detailType === "PD") {
            const pDUpdatedData = personalDetails.map((item) => {
                if (item.id === id) {
                    return { ...item, value }; 
                }
                return item;
            });
            setPersonalDetails(pDUpdatedData);
        } else if (detailType === "CD") {
            const cDUpdatedData = clinicDetails.map((item) => {
                if (item.id === id) {
                    return { ...item, value }; 
                }
                return item;
            });
            setClinicDetails(cDUpdatedData);
        }
        
    }

    const handleButtonClick = () => {
        step === "PD" ? setStep("CD") : setStep("IDP");
        // If step is "PD" set headerData. 1. Change status of "Personal Details" to "COMPLETED" 2. Change status of "Clinic Details" to "STARTED" and if step is "CD" change headerData. 1. Change status of "Clinic Details" to "COMPLETED" 2. Change status of "ID Proof" to "STARTED"
        const updatedHeaderData = headerData.map((item, index) => {
            if (step === "PD") {
                if (index === 0) {
                    return { ...item, status: "COMPLETED", };
                }
                if (index === 1) {
                    return { ...item, status: "STARTED" };
                }
            }
            if (step === "CD") {
                if (index === 1) {
                    return { ...item, status: "COMPLETED" };
                }
                if (index === 2) {
                    return { ...item, status: "STARTED" };
                }
            }
            return item;
        });
        setHeaderData(updatedHeaderData);
        // i want to scroll to top of the screen after clicking on continue button
        if (scrollViewRef.current) {
          (scrollViewRef.current as any).scrollTo({ x: 0, y: 0, animated: true });
        }
    }

    // define a function handleDisable which will return true if any of the input field is empty from profileDetails
    const handleDisable = () => {
        if (step === "PD") {
            return personalDetails.some((item) => item.isMandatory && item.value === "");
        } else if (step === "CD") {
            return clinicDetails.some((item) => item.isMandatory && item.value === "");
        }
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
            case "RADIO":
                return (
                    <CustomRadio data={item} onChange={(value, id) => handleChange(value, id, detailType)} />
                )
                break;
            default:
                break;
        }
    }

    const renderValue = () => {
        switch (step) {
            case "PD":
                return (personalDetails.map((item) => {
                            return (
                                <View key={item?.id} style={{ marginBottom: 24 }} >
                                    {renderInputType(item, "PD")}
                                </View>
                            )
                        }))
                break;
            case "CD":
                return (clinicDetails.map((item) => {
                    return (
                        <View key={item?.id} style={{ marginBottom: 24 }} >
                            {renderInputType(item, "CD")}
                        </View>
                    )
                }))
                break;
            case "IDP":
                return (
                    <Text> ID Proof </Text>
                )
            default:
                break;
        }
    }

    return (
        <View style={style.container} >
            <SignUpHeader data={headerData} />
            <ScrollView
                ref={scrollViewRef}
                style={{ 
                    display: 'flex',
                    backgroundColor: "#F9F9F9",
                    borderRadius: 8,
                    borderColor: "#DDDDDD",
                    marginTop: 16,
                    marginHorizontal: 12,
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
