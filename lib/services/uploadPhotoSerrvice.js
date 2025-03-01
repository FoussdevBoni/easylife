import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../../utils/firestorageConfig';


export const uploadPhotoService = {
    
async takePhoto(sourceType , folder , userId) {
    try {
      let pickerResult;
      if (sourceType === 'camera') {
        pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      } else if (sourceType === 'library') {
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      }
  
      if (!pickerResult.cancelled) {
        const { uri } = pickerResult.assets[0];
        const fileName = uri.split("/").pop();
  
        const uploadResp = await uploadToFirebase(uri, fileName, folder, userId, (progress) => progress);
        
        return { uploadResp }; 
      }
    } catch (error) {
      Alert.alert("Erreur survenue lors de l'ajout de l'image ");
      return { error };
    }
  }
}
