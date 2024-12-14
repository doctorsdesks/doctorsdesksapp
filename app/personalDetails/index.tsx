import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { DocStatusType } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { getValueById, uploadFile } from '@/components/Utils';
import CustomInput2 from '@/components/CustomInput2';
import { signUpDetailsInitial } from '@/context/InitialState';
import CustomRadio from '@/components/CustomRadio';
import CustomInputBoxes from '@/components/CustomInputBoxes';
import { URLS } from '@/constants/Urls';
import axios from 'axios';
import { router } from 'expo-router';
import Loader from '@/components/Loader';

const PersonalDetailsSetting = () => {
    const { height } = Dimensions.get('window');
    const { doctorDetails, setDoctorDetails } = useAppContext();
    const scrollViewRef = React.useRef(null);
    const [doctorData, setDoctorData] = useState<any>();
    const [navData, setNavData] = useState<Array<NavbarObject>>([
        {
            label: "Personal",
            isActive: true,
        },
        {
            label: "ID Proof",
            isActive: false,
        }
    ])
    const [loader, setLoader] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [idInfo, setIdInfo] = useState<any>({});

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if(doctorDetails) {
            const personalData = signUpDetailsInitial?.personalDetails;
            const newDoctorData = {
                imageUrl: doctorDetails?.imageUrl,
                docStatus: doctorDetails?.docStatus,
                phone: doctorDetails?.phone,
                personalData: personalData?.map((item: any) => {
                    if (item?.id === "fullName") return { ...item, value: doctorDetails?.name, isDisabled: true };
                    if (item?.id === "gender") return { ...item, value: doctorDetails?.gender, isDisabled: true };
                    if (item?.id === "email") return { ...item, value: doctorDetails?.email, isDisabled: true };
                    if (item?.id === "experience") return { ...item, value: doctorDetails?.experience, isDisabled: true };
                    if (item?.id === "specialisation") return { ...item, value: doctorDetails?.specialisation, isDisabled: true };
                    if (item?.id === "otherQualification") return { ...item, value: doctorDetails?.otherQualification, isDisabled: true };
                    if (item?.id === "languages") return { ...item, value: doctorDetails?.languages, isDisabled: true };
                }),
            }
            setDoctorData(newDoctorData);

            let newIdInfo: any = {
                registrationInfo: { ...doctorDetails?.registrationInfo, isOpen: false }
            };
            if (doctorDetails?.aadharInfo?.frontUrl !== "") {
                newIdInfo["aadharInfo"] = { ...doctorDetails?.aadharInfo, isOpen: false };
            }
            if (doctorDetails?.panInfo?.frontUrl !== "") {
                newIdInfo["panInfo"] = { ...doctorDetails?.panInfo, isOpen: false };
            }
            setIdInfo(newIdInfo);
        }
    },[])

    useEffect(() => {
        if (isEditable) {
            let newDoctorData = { ...doctorData };
            let newPersonalData = [...newDoctorData?.personalData]
            newPersonalData = newPersonalData?.map((item: any) => {
                if (item?.id === "fullName") return { ...item, value: doctorDetails?.name, isDisabled: true };
                if (item?.id === "gender") return { ...item, value: doctorDetails?.gender, isDisabled: true };
                if (item?.id === "email") return { ...item, value: doctorDetails?.email, isDisabled: false };
                if (item?.id === "experience") return { ...item, value: doctorDetails?.experience, isDisabled: false };
                if (item?.id === "specialisation") return { ...item, value: doctorDetails?.specialisation, isDisabled: false };
                if (item?.id === "otherQualification") return { ...item, value: doctorDetails?.otherQualification, isDisabled: false };
                if (item?.id === "languages") return { ...item, value: doctorDetails?.languages, isDisabled: false };
            }),
            newDoctorData = {
                ...newDoctorData,
                personalData: newPersonalData
            }
            setDoctorData(newDoctorData);
        }
    },[isEditable])

    const handleNavClick = (value: string) => {
        const newNavData = navData?.map((item: NavbarObject) => ({ ...item, isActive: item?.label === value ? true : false }));
        setNavData(newNavData);
    }

    const updateDoctor = async () => {
        const updateData = {
            experience: getValueById(doctorData?.personalData, "experience"),
            specialisation: getValueById(doctorData?.personalData, "specialisation"),
            otherQualification: getValueById(doctorData?.personalData, "otherQualification"),
            languages: getValueById(doctorData?.personalData, "languages"),
            imageUrl: doctorData?.imageUrl || "",
        }
        const url = URLS.BASE + URLS.UPDATE_DOCTOR + "/" + doctorData.phone;
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
                    text1: data.message,
                    visibilityTime: 5000,
                });
            }
            setLoader(false);
            setDoctorDetails(data.data);
            router.replace("/dashboard/profile");
        } catch (error: any) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 5000,
                });
            setLoader(false);
        }
    }

    const handleButtonClick = () => {
        if (isEditable) {
            setLoader(true);
            updateDoctor();
        } else {
            setIsEditable(true);
        }
    }

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
            
            handleUploadImage(uriInfo);
          }
        } catch (error) {
          console.log('Error picking image: ', error);
        }
    };

    const handleUploadImage = async (file: any) => {
        setLoader(true);
        const fileName = file?.fileName;
        const phoneNumber = doctorData?.phone;
        const uploadedImageUrlObject = await uploadFile(file, fileName, phoneNumber);
        if (uploadedImageUrlObject.status === "SUCCESS"){
            Toast.show({
                type: 'success',  
                text1: 'Image uploaded Successfully.',
                visibilityTime: 5000,
            });
            setDoctorData({
                ...doctorData,
                imageUrl: uploadedImageUrlObject.data
            });
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: `Something went wrong, error: ${uploadedImageUrlObject.data}`,
                visibilityTime: 5000,
            });
        }
    }

    const handleChange = (value: string, id: string) => {
            let newDoctorData = { ...doctorData };
            const personalDetails = [...newDoctorData?.personalData];
            const newPersonalData = personalDetails.map((item: any) => {
                if (item.id === id) {
                    return { ...item, value }; 
                }
                return item;
            });
            newDoctorData = {
                ...newDoctorData,
                personalData: newPersonalData
            }
            setDoctorData(newDoctorData); 
    }

    const handleChangeLanguage = (newValue: string, id: string, type: string) => {
        let newDoctorData = { ...doctorData };
        let personalDetails = [...newDoctorData?.personalData];
        if(type === "ADD"){
            personalDetails = personalDetails.map((item: any) => {
                if (item.id === id) {
                    return { ...item, value: [ ...item?.value, newValue] }; 
                }
                return item;
            });
        } else if(type === "REMOVE"){
            personalDetails = personalDetails.map((item: any) => {
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
        newDoctorData = {
            ...newDoctorData,
            personalData: personalDetails
        }
        setDoctorData(newDoctorData);
    }

    const renderInputType = (item: any) => {
        switch (item.inputType) {
            case "TEXT":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "NUMBER":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "EMAIL":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "RADIO":
                return (
                    <CustomRadio data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "BOXES": 
                return (
                    <CustomInputBoxes data={item} onChange={(value, id, type) => handleChangeLanguage(value, id, type)} />
                )
            default:
                break;
        }
    }

    const openDocumentCard = (type: string) => {
        const newIdInfo = { ...idInfo, [type]: { ...idInfo[type], isOpen: !idInfo[type]?.isOpen } };
        setIdInfo(newIdInfo);
    }

    return (
        <View style={{ marginHorizontal: 16 }}>
            <Navbar data={navData} onClick={handleNavClick} />
            {navData[0]?.isActive ?
                <View style={{ height: height - 100 }} >
                    <View style={{ display: 'flex', alignItems: "center", justifyContent: 'center', marginTop: 32 }} >
                        <View style={{ position: 'relative' }} >
                            {doctorData?.docStatus === DocStatusType.VERIFIED && <View style={{ position: 'absolute', right: 4, top: 8, zIndex: 1 }} >
                                <Icon iconType='verifiedIcon' />
                            </View>}
                            {doctorData?.imageUrl !== "" && <Image source={{uri: doctorDetails?.imageUrl}} resizeMode='cover' height={100} width={100} style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", borderRadius: 100 }} />}
                        </View>
                        {isEditable && <Pressable onPress={pickImage} style={{ borderBottomWidth: 1, borderBottomColor: "#1EA6D6", marginTop: 12}}>
                            <Text style={{ color: "#1EA6D6"}} >
                                Change Photo
                            </Text>
                        </Pressable>}
                    </View>
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
                        {doctorData?.personalData?.map((item: any) => {
                                    return (
                                        <View key={item?.id} style={{ marginBottom: 16 }} >
                                            {renderInputType(item)}
                                        </View>
                                    )
                                })}
                    </ScrollView>
                    <View style={{ display: "flex", alignItems: "center", marginTop: 24, marginBottom: 32 }} >
                        <CustomButton width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleButtonClick} />
                    </View>
                </View>
            :   
                <View style={{ marginTop: 32 }} >
                    <View style={{ padding: 16, borderColor: "#D9D9D9", borderWidth: 1, borderTopRightRadius: 8, borderTopLeftRadius: 8 }}  >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                <View style={{ padding: 6, borderWidth: 1, borderRadius: 4, borderColor: "#D9D9D9" }} >
                                    <Icon iconType='registrationIcon' height='20' width='20' />
                                </View>
                                <Text style={{ fontSize: 14, lineHeight: 14, fontWeight: 600, color: "#32383D", marginLeft: 8 }} >
                                    Registration Certificate 
                                </Text>
                            </View>
                            <View style={{ transform: [{ rotate: idInfo?.registrationInfo?.isOpen ? '180deg' : '0' }] }} >
                                <Icon iconType='downArrow' onClick={() => openDocumentCard("registrationInfo")} />
                            </View>
                        </View>
                        {idInfo?.registrationInfo?.isOpen &&
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }} >
                                {idInfo?.registrationInfo?.frontUrl !== "" && 
                                    <View style={{ borderColor: "#D9D9D9", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }} >
                                        <Image source={{uri: idInfo?.registrationInfo?.frontUrl}} resizeMode='cover' height={86} width={108} style={{height: 86, width: 108 }} />
                                    </View>
                                }
                                {idInfo?.registrationInfo?.backUrl !== "" && 
                                    <View style={{ borderColor: "#D9D9D9", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }} >
                                        <Image source={{uri: idInfo?.registrationInfo?.backUrl}} resizeMode='cover' height={86} width={108} style={{ height: 86, width: 108 }} />
                                    </View>
                                }
                            </View>
                        }
                    </View>
                    {idInfo?.aadharInfo &&
                        <View style={{ padding: 16, borderColor: "#D9D9D9", borderWidth: 1, borderBottomRightRadius: idInfo?.panInfo ? 0 : 8, borderBottomLeftRadius: idInfo?.panInfo ? 0 : 8 }}  >
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                    <View style={{ padding: 6, borderWidth: 1, borderRadius: 4, borderColor: "#D9D9D9" }} >
                                        <Icon iconType='aadharPan' height='20' width='20' />
                                    </View>
                                    <Text style={{ fontSize: 14, lineHeight: 14, fontWeight: 600, color: "#32383D",  marginLeft: 8 }} >
                                        Aadhar Card 
                                    </Text>
                                </View>
                                <View style={{ transform: [{ rotate: idInfo?.aadharInfo?.isOpen ? '180deg' : '0' }] }} >
                                    <Icon iconType='downArrow' onClick={() => openDocumentCard("aadharInfo")} />
                                </View>
                            </View>
                            {idInfo?.aadharInfo?.isOpen &&
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }} >
                                    {idInfo?.aadharInfo?.frontUrl !== "" && 
                                        <View style={{ borderColor: "#D9D9D9", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }} >
                                            <Image source={{uri: idInfo?.aadharInfo?.frontUrl}} resizeMode='cover' height={86} width={108} style={{ height: 86, width: 108 }} />
                                        </View>
                                    }
                                    {idInfo?.aadharInfo?.backUrl !== "" && 
                                        <View style={{ borderColor: "#D9D9D9", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }} >
                                            <Image source={{uri: idInfo?.aadharInfo?.backUrl}} resizeMode='cover' height={86} width={108} style={{ height: 86, width: 108 }} />
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    }
                    {idInfo?.panInfo &&
                        <View style={{ padding: 16, borderColor: "#D9D9D9", borderWidth: 1, borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }}  >
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                                    <View style={{ padding: 6, borderWidth: 1, borderRadius: 4, borderColor: "#D9D9D9" }} >
                                        <Icon iconType='aadharPan' height='20' width='20' />
                                    </View>
                                    <Text style={{ fontSize: 14, lineHeight: 14, fontWeight: 600, color: "#32383D",  marginLeft: 8 }} >
                                        Pan Card 
                                    </Text>
                                </View>
                                <View style={{ transform: [{ rotate: idInfo?.panInfo?.isOpen ? '180deg' : '0' }] }} >
                                    <Icon iconType='downArrow' onClick={() => openDocumentCard("panInfo")} />
                                </View>
                            </View>
                            {idInfo?.panInfo?.isOpen &&
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }} >
                                    {idInfo?.panInfo?.frontUrl !== "" && 
                                        <View style={{ borderColor: "#D9D9D9", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }} >
                                            <Image source={{uri: idInfo?.panInfo?.frontUrl}} resizeMode='cover' height={86} width={108} style={{ height: 86, width: 108 }} />
                                        </View>
                                    }
                                    {idInfo?.panInfo?.backUrl !== "" && 
                                        <View style={{ borderColor: "#D9D9D9", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }} >
                                            <Image source={{uri: idInfo?.panInfo?.backUrl}} resizeMode='cover' height={86} width={108} style={{ height: 86, width: 108 }} />
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    }
                </View>
            }
            {loader && <Loader />}
        </View>
    );
};

export default PersonalDetailsSetting;