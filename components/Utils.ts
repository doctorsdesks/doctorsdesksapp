import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { URLS } from '@/constants/Urls';
import axios from 'axios';


export const uploadFile = async (fileUri: any, fileName: string, phoneNumber: string) => {
    const fileExtension = fileUri.uri.split('.').pop();
    const storageRef = storage().ref(`uploads/${phoneNumber}/${fileName}`);
    try {
        const task = storageRef.putFile(fileUri.uri);
        task.on('state_changed', taskSnapshot => {
        // console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });
        await task;
        const downloadUrl = await storageRef.getDownloadURL();
        Toast.show({
            type: 'success',  
            text1: 'Image uploaded Successfully.',
            visibilityTime: 3000,
        });
        return {
            data: downloadUrl,
            status: "SUCCESS"
        }
    } catch (error) {
        return {
            data: error,
            status: "FAILURE"
        }
    }
  };

  export async function saveSecureKey(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  export async function getSecureKey(key: string) {
    const value = await SecureStore.getItemAsync(key);
    return value;
  }

  export const capitalizeWords = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  export const changeTimeToAmPm = (time: string) => {
    // time = 14:20
    let [hh, mm] = time?.split(":");
    let period = "AM";
    if (parseInt(hh) >= 12) {
      period = "PM";
      const finalHH = (parseInt(hh) - 12);
      hh = finalHH === 0 ? hh : finalHH?.toString().padStart(2, "0");
    }
    return hh + ":" + mm + " " + period;
  }

  export const changeTimeTwentyFourHours = (time: string) => {
    const [timePart, period] = time.split(" "); 
    let [hours, minutes] = timePart.split(":").map(Number);
  
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  export const getAppointments = async (phone: string, date: string) => {
    const url = URLS.BASE + URLS.GET_APPOINTMENTS + "/?doctor=" + phone + "&date=" + date;
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'doctorsdesks_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
            Toast.show({
                type: 'success',  
                text1: data.message,
                visibilityTime: 3000,
            });
            return {
              status: "SUCCESS",
              data: data.data,
            }
        } else {
          return {
            status: "FAILURE",
            error: "Something wrong. Please try again.",
          }
        }
    } catch (error: any) {
        return {
          status: "FAILURE",
          error: error?.response?.data?.message
        }
    }
  }

  export const getTranslations = async () => {
    const url = URLS.BASE + URLS.GET_TRANSLATIONS;
    try {
      const response = await axios.get(url,
        {
          headers: {
            'X-Requested-With': 'doctorsdesks_web_app',
          },
        }
      );
    const { data, status } = response;
    if (status === 200){
        Toast.show({
            type: 'success',  
            text1: data.message,
            visibilityTime: 3000,
        });
        return {
          status: "SUCCESS",
          data: data.data,
        }
    } else {
      return {
        status: "FAILURE",
        error: "Something wrong. Please try again.",
      }
    }
    } catch (error: any) {
      return {
        status: "FAILURE",
        error: error?.response?.data?.message
      }
    }
  }

  export const getDoctorDetails = async (phone: string) => {
    const url = URLS.BASE + URLS.UPDATE_DOCTOR + "/" + phone;
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'doctorsdesks_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
            Toast.show({
                type: 'success',  
                text1: data.message,
                visibilityTime: 3000,
            });
            return {
              status: "SUCCESS",
              data: data.data,
            }
        } else {
          return {
            status: "FAILURE",
            error: "Something wrong. Please try again.",
          }
        }
    } catch (error: any) {
        return {
          status: "FAILURE",
          error: error?.response?.data?.message
        }
    }
  }

  export const getPatientList = async (searchString: string) => {
    const url = URLS.BASE + URLS.GET_PATIENT_LIST + "/" + searchString;
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'doctorsdesks_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
            Toast.show({
                type: 'success',  
                text1: data.message,
                visibilityTime: 3000,
            });
            return {
              status: "SUCCESS",
              data: data.data,
            }
        } else {
          return {
            status: "FAILURE",
            error: "Something wrong. Please try again.",
          }
        }
    } catch (error: any) {
        return {
          status: "FAILURE",
          error: error?.response?.data?.message
        }
    }
  }

  export const getPatient = async (phone: any) => {
    const url = URLS.BASE + URLS.GET_PATIENT + "/" + phone;
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'doctorsdesks_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
            Toast.show({
                type: 'success',  
                text1: data.message,
                visibilityTime: 3000,
            });
            return {
              status: "SUCCESS",
              data: data.data,
            }
        } else {
          return {
            status: "FAILURE",
            error: "Something wrong. Please try again.",
          }
        }
    } catch (error: any) {
        return {
          status: "FAILURE",
          error: error?.response?.data?.message
        }
    }
  }

  export const  formatDateToYYYYMMDD = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` 
  }

  export const getValueById = (data: Array<any>, id: string) => {
    return data?.find((item: {id: string}) => item?.id === id)?.value;
  }

  export const getClinics = async (phone: string) => {
    const url = URLS.BASE + URLS.GET_CLINICS + "/" + phone;
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'doctorsdesks_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
            Toast.show({
                type: 'success',  
                text1: data.message,
                visibilityTime: 3000,
            });
            return {
              status: "SUCCESS",
              data: data.data[0],
            }
        } else {
          return {
            status: "FAILURE",
            error: "Something wrong. Please try again.",
          }
        }
    } catch (error: any) {
        return {
          status: "FAILURE",
          error: error?.response?.data?.message
        }
    }
  }

  export const finalText = (text: string, translations: any, selectedLanguage: any) => {
    let currentText = text;
    if (text !== "") currentText = currentText?.toLowerCase();
    if (translations && translations[selectedLanguage] && (translations[selectedLanguage][currentText]) ) {
        return translations[selectedLanguage][currentText];
    } else {
        return text;
    }
}