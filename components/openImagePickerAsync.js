import ImagePicker from 'react-native-image-crop-picker';

const openImagePickerAsync = async (setSelectedImage, camera = true) => {
  let result;
  const options = {
    cropping: true,
    mediaType: 'photo',
    enableRotationGesture: true,
    freeStyleCropEnabled: true,
  };
  try {
    if (camera) {
      result = await ImagePicker.openCamera(options);
    } else {
      result = await ImagePicker.openPicker(options);
    }
    setSelectedImage(result);
  } catch (error) {
    console.log(error);
  }
  
};

export default openImagePickerAsync;
