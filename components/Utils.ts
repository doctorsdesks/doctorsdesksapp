import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';

export const uploadFile = async (fileUri: any, fileName: string) => {
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