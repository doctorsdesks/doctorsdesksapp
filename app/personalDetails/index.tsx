import CustomButton from '@/components/CustomButton';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { CONFIGS, DocStatusType } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { finalText, getConfig, getSecureKey, getValueById, uploadFile } from '@/components/Utils';
import CustomInput2 from '@/components/CustomInput2';
import { signUpDetailsInitial } from '@/context/InitialState';
import CustomRadio from '@/components/CustomRadio';
import CustomInputBoxes from '@/components/CustomInputBoxes';
import { URLS } from '@/constants/Urls';
import axios from 'axios';
import { router } from 'expo-router';
import Loader from '@/components/Loader';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '@/components/MainHeader';
import { ThemedView } from '@/components/ThemedView';
import SearchSelect from '@/components/SearchSelect';
import { ThemedText } from '@/components/ThemedText';

const PersonalDetailsSetting = () => {
    const { height } = Dimensions.get('window');
    const { doctorDetails, setDoctorDetails, translations, selectedLanguage } = useAppContext();
    const scrollViewRef = React.useRef(null);
    const scrollDocRef = React.useRef(null);
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
    const [showImage, setShowImage] = useState<boolean>(true);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
    const [specialisationOptions, setSpecialisationOptions] = React.useState<any>([]);

    useEffect(() => {
        const backAction = () => {
            if (isKeyboardOpen) {
                Keyboard.dismiss();
                return true;
            } else {
                router.replace("/dashboard/profile");
                return true;
            }
        };

        getSpecialisation();

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
                    if (item?.id === "dob") return { ...item, value: doctorDetails?.dob, isDisabled: true };
                    if (item?.id === "experience") return { ...item, value: doctorDetails?.experience, isDisabled: true };
                    if (item?.id === "graduation") return { ...item, value: doctorDetails?.graduation, isDisabled: true };
                    if (item?.id === "graduationCollege") return { ...item, value: doctorDetails?.graduationCollege, isDisabled: true };
                    if (item?.id === "graduationYear") return { ...item, value: doctorDetails?.graduationYear, isDisabled: true };
                    if (item?.id === "specialisation") return { ...item, value: doctorDetails?.specialisation, isDisabled: true };
                    if (item?.id === "specialisationCollege") return { ...item, value: doctorDetails?.specialisationCollege, isDisabled: true };
                    if (item?.id === "specialisationYear") return { ...item, value: doctorDetails?.specialisationYear, isDisabled: true };
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
    },[doctorDetails])

    const getSpecialisation = async () => {
        const response = await getConfig(CONFIGS.SPECIALISATION);

        if (response?.status === "SUCCESS") {
            const specialisation = response?.data?.data || [];
            let finalSpec = specialisation?.map((item: any) => Object.keys(item)[0]);
            finalSpec.sort((a: string, b: string) => a.localeCompare(b)); // Sort alphabetically
            setSpecialisationOptions(finalSpec);
        }
    }

    useEffect(() => {
        if (isEditable) {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
                { setIsKeyboardOpen(true); setShowImage(false)}
              );
              const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
               { setIsKeyboardOpen(false); setShowImage(true)}
              );
            let newDoctorData = { ...doctorData };
            let newPersonalData = [...newDoctorData?.personalData]
            newPersonalData = newPersonalData?.map((item: any) => {
                if (item?.id === "fullName") return { ...item, value: doctorDetails?.name, isDisabled: true };
                if (item?.id === "gender") return { ...item, value: doctorDetails?.gender, isDisabled: true };
                if (item?.id === "dob") return { ...item, value: doctorDetails?.dob, isDisabled: true };
                if (item?.id === "email") return { ...item, value: doctorDetails?.email, isDisabled: true };
                if (item?.id === "experience") return { ...item, value: doctorDetails?.experience, isDisabled: false };
                if (item?.id === "graduation") return { ...item, value: doctorDetails?.graduation, isDisabled: true };
                if (item?.id === "graduationCollege") return { ...item, value: doctorDetails?.graduationCollege, isDisabled: true };
                if (item?.id === "graduationYear") return { ...item, value: doctorDetails?.graduationYear, isDisabled: true };
                if (item?.id === "specialisation") return { ...item, value: doctorDetails?.specialisation, isDisabled: false };
                if (item?.id === "specialisationCollege") return { ...item, value: doctorDetails?.specialisationCollege, isDisabled: false };
                if (item?.id === "specialisationYear") return { ...item, value: doctorDetails?.specialisationYear, isDisabled: false };
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
            specialisationCollege: getValueById(doctorData?.personalData, "specialisationCollege"),
            specialisationYear: getValueById(doctorData?.personalData, "specialisationYear"),
            otherQualification: getValueById(doctorData?.personalData, "otherQualification"),
            languages: getValueById(doctorData?.personalData, "languages"),
            imageUrl: doctorData?.imageUrl || "",
        }
        const url = URLS.BASE + URLS.UPDATE_DOCTOR + "/" + doctorData.phone;
        const authToken = await getSecureKey("userAuthtoken");
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'nirvaanhealth_web_app',
                  "Authorization": `Bearer ${authToken}`
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                Toast.show({
                    type: 'success',  
                    text1: data.message,
                    visibilityTime: 3000,
                });
                setDoctorDetails(data.data);
                setLoader(false);
                router.replace("/dashboard/profile");
            } else {
                Toast.show({
                    type: 'error',  
                    text1: 'Something wrong happened. Please try again!',
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',  
                text1: error.response.data.message,
                visibilityTime: 3000,
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
        const phoneNumber = doctorData?.phone;
        const uploadedImageUrlObject = await uploadFile(file, fileName, phoneNumber);
        if (uploadedImageUrlObject.status === "SUCCESS"){
            Toast.show({
                type: 'success',  
                text1: 'Image uploaded Successfully.',
                visibilityTime: 3000,
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
                visibilityTime: 3000,
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
        switch (item?.inputType) {
            case "TEXT":
                return (
                    <CustomInput2 data={item} handleFocus={() => setShowImage(false)} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "NUMBER":
                return (
                    <CustomInput2 data={item} handleFocus={() => setShowImage(false)} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "EMAIL":
                return (
                    <CustomInput2 data={item} handleFocus={() => setShowImage(false)} onChange={(value, id) => handleChange(value, id)} />
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
                break;
            case "DATE":
                return (
                    <CustomInput2 data={item} handleFocus={() => setShowImage(false)} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "SEARCHSELECT": {
                let finalItem = { ...item };
                finalItem.options = specialisationOptions;
                return (
                    <SearchSelect data={finalItem} onChange={(value, id) => handleChange(value, id)} />
                )
            }
                break;
            default:
                break;
        }
    }

    const openDocumentCard = (type: string) => {
        const newIdInfo = { ...idInfo, [type]: { ...idInfo[type], isOpen: !idInfo[type]?.isOpen } };
        setIdInfo(newIdInfo);
    }

    return ( loader ? 
            <Loader />
        :
            <ThemedView style={styles.container} >
                <MainHeader selectedNav='personalDetails' />
                <Navbar data={navData} onClick={handleNavClick} />
                {navData[0]?.isActive ?
                    <View style={{ height: height - 100 }} >
                        {showImage && <View style={{ display: 'flex', alignItems: "center", justifyContent: 'center', marginTop: 32 }} >
                            <View style={{ position: 'relative' }} >
                                <View style={{ position: 'absolute', right: 4, top: 8, zIndex: 2 }} >
                                    {doctorDetails?.docStatus === DocStatusType.VERIFIED ? 
                                        <Image
                                            source={require('@/assets/images/verified.png')}
                                            style={styles.icon}
                                        /> 
                                    : 
                                        <Image
                                            source={require('@/assets/images/notVerifiedIcon.png')}
                                            style={styles.icon}
                                        /> 
                                    }
                                </View>
                                {doctorData && doctorData?.imageUrl && doctorData?.imageUrl !== "" ? <Image source={{uri: doctorData?.imageUrl}} resizeMode='cover' height={100} width={100} style={{ marginTop: 8, height: 100, width: 100, borderColor: "#CFD8DC", borderRadius: 100 }} />
                                : 
                                    <Image
                                        source={require('@/assets/images/Girl_doctor.png')}
                                        style={styles.profileImage}
                                    />
                                }
                            </View>
                            {isEditable && <Pressable onPress={pickImage} style={{ borderBottomWidth: 1, borderBottomColor: "#1EA6D6", marginTop: 12}}>
                                <ThemedText type='link' >{finalText("Change Photo", translations, selectedLanguage)}</ThemedText>
                            </Pressable>}
                        </View>}
                        <ScrollView
                            ref={scrollViewRef}
                            style={{ 
                                display: 'flex',
                                borderRadius: 8,
                                maxHeight: isEditable ? isKeyboardOpen ? height - 426 : height - 366 : height - 336,
                                borderColor: "#DDDDDD",
                                marginTop: 16,
                                borderWidth: 1,
                                paddingHorizontal: 12,
                                paddingVertical: 16,
                            }}
                        >
                            {doctorData?.personalData?.map((item: any) => {
                                        return (
                                            <View key={item?.id} style={{ marginBottom: 18 }} >
                                                {renderInputType(item)}
                                            </View>
                                        )
                                    })}
                        </ScrollView>
                        <View style={{ display: "flex", alignItems: "center", position: 'absolute', bottom: 12, right: 0, left: 0, zIndex: 2 }} >
                            <CustomButton multiLingual={true} width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleButtonClick} />
                        </View>
                    </View>
                :   
                    <View style={{ marginTop: 32 }} >
                        <ScrollView
                            ref={scrollDocRef}
                            style={{ 
                                display: 'flex',
                                borderRadius: 8,
                                maxHeight: height - 200,
                                borderColor: "#DDDDDD",
                                marginTop: 16,
                                borderWidth: 1,
                                paddingHorizontal: 12,
                                paddingVertical: 12,
                            }}
                        >
                            <View style={{ padding: 16, borderColor: "#D9D9D9", borderWidth: 1, borderBottomWidth: 0, borderTopRightRadius: 8, borderTopLeftRadius: 8 }}  >
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                        <View style={{ padding: 6, borderWidth: 1, borderRadius: 4, borderColor: "#D9D9D9" }} >
                                            <Image source={require('../../assets/images/registration.png')} resizeMode='contain' height={24} width={24} />
                                        </View>
                                        <ThemedText style={{ fontSize: 14, lineHeight: 14, fontWeight: 600, marginLeft: 8 }} >{finalText("Registration Certificate", translations, selectedLanguage)} </ThemedText>
                                    </View>
                                    <Pressable onPress={() => openDocumentCard("registrationInfo")} style={{ transform: [{ rotate: idInfo?.registrationInfo?.isOpen ? '180deg' : '0deg' }] }} >
                                        <Ionicons size={24} color={"#A9A9AB"} name='chevron-down' />
                                    </Pressable>
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
                                <View style={{ padding: 16, borderColor: "#D9D9D9", borderWidth: 1, borderBottomWidth: idInfo?.panInfo ? 0 : 1, borderBottomRightRadius: idInfo?.panInfo ? 0 : 8, borderBottomLeftRadius: idInfo?.panInfo ? 0 : 8 }}  >
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                            <View style={{ padding: 6, borderWidth: 1, borderRadius: 4, borderColor: "#D9D9D9" }} >
                                                <Image source={require('../../assets/images/address.png')} resizeMode='contain' height={24} width={24} />
                                            </View>
                                            <ThemedText style={{ fontSize: 14, lineHeight: 14, fontWeight: 600, marginLeft: 8 }} >{finalText("Aadhar Card", translations, selectedLanguage)} </ThemedText>
                                        </View>
                                        <Pressable onPress={() => openDocumentCard("aadharInfo")} style={{ transform: [{ rotate: idInfo?.aadharInfo?.isOpen ? '180deg' : '0deg' }] }} >
                                            <Ionicons size={24} color={"#A9A9AB"} name='chevron-down' />
                                        </Pressable>
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
                                                <Image source={require('../../assets/images/address.png')} resizeMode='contain' height={24} width={24} />
                                            </View>
                                            <ThemedText style={{ fontSize: 14, lineHeight: 14, fontWeight: 600, marginLeft: 8 }} >{finalText("Pan Card", translations, selectedLanguage)} </ThemedText>
                                        </View>
                                        <Pressable onPress={() => openDocumentCard("panInfo")} style={{ transform: [{ rotate: idInfo?.panInfo?.isOpen ? '180deg' : '0deg' }] }} >
                                            <Ionicons size={24} color={"#A9A9AB"} name='chevron-down' />
                                        </Pressable>
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
                        </ScrollView>
                    </View>
                }
            </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 62,
        height: "100%",
        position: 'relative'
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    icon: {
        width: 24,
        height: 24
    }
})

export default PersonalDetailsSetting;