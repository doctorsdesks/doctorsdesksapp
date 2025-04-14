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

  export const getAppointments = async (phone: string, date?: string) => {
    let url = URLS.BASE + URLS.GET_APPOINTMENTS + "/?doctor=" + phone;
    if (date && date !== "") {
      url = URLS.BASE + URLS.GET_APPOINTMENTS + "/?doctor=" + phone + "&date=" + date;
    }
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                 "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
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
            'X-Requested-With': 'nirvaanhealth_web_app',
          },
        }
      );
    const { data, status } = response;
    if (status === 200){
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
    const url = URLS.BASE + URLS.UPDATE_DOCTOR + "?phone=" + phone;
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
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
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
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
    let month: any = date.getMonth()+1;
    if (JSON.stringify(month)?.length === 1) month = "0" + month;
    return `${date.getFullYear()}-${month}-${date.getDate()}` 
  }

  export const getValueById = (data: Array<any>, id: string) => {
    return data?.find((item: {id: string}) => item?.id === id)?.value;
  }

  export const getClinics = async (phone: string) => {
    const url = URLS.BASE + URLS.GET_ALL_CLINICS + "/?doctor=" + phone;
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
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

  export const updateClinic = async (clinicId: string, payload: any) => {
    const url = URLS.BASE + URLS.UPDATE_CLINIC + "/"  + clinicId;
        const authToken = await getSecureKey("userAuthtoken");
        try {
            const response = await axios.post(url, payload,
              {
                headers: {
                  'X-Requested-With': 'nirvaanhealth_web_app',
                  "Authorization": `Bearer ${authToken}`
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
              return {
                status: "SUCCESS",
                data: data.data,
                message: data.message
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

  export const getConfig = async (type: string) => {
    const url = URLS.BASE + URLS.GET_CONFIG + "?type=" + type;
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
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

  export const login = async (payload: any) => {
    const url = URLS.BASE + URLS.LOGIN;
    try {
        const response = await axios.post(url, payload,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
              },
            }
          );
        const { data, status } = response;
        if (status === 201){
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

  export const logout = async (payload: any) => {
    const url = URLS.BASE + URLS.LOGOUT;
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.post(url, payload,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 201){
            await saveSecureKey("userAuthtoken", "");
            return {
              status: "SUCCESS",
              data: data.data,
            }
        } else {
          await saveSecureKey("userAuthtoken", "");
          return {
            status: "FAILURE",
            error: "Something wrong. Please try again.",
          }
        }
    } catch (error: any) {
      await saveSecureKey("userAuthtoken", "");
        return {
          status: "FAILURE",
          error: error?.response?.data?.message
        }
    }
    
  }

  export const getDfo = async (phone: string) => {
    const url = URLS.BASE + URLS.DFO + "?doctor=" + phone;
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
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

  export const getSlots = async (id: string, date: string) => {
    const url = URLS.BASE + URLS.GET_SLOTS + "/?clinic=" + id + "&date=" + date;
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.get(url,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 200){
            return {
              status: "SUCCESS",
              data: data.data, // {message, slots}
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

  export const blockSlots = async (payload: any) => {
    const url = URLS.BASE + URLS.BLOCK_SLOTS;
    const authToken = await getSecureKey("userAuthtoken");
    try {
        const response = await axios.post(url, payload,
            {
              headers: {
                'X-Requested-With': 'nirvaanhealth_web_app',
                "Authorization": `Bearer ${authToken}`
              },
            }
          );
        const { data, status } = response;
        if (status === 201){
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