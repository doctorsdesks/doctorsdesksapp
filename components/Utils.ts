import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';


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
            visibilityTime: 5000,
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