import {useState} from 'react';
import {View, Button, Dimensions, Image,PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';
import React from 'react';
import common from '../styles/Common';
import inferImage from '../api/Inference';

const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState();
  const [outputWidth, onChangeNumber] = React.useState('650');
  const ImageToProcess = () => {
    if (selectedImage) {
      return (
        <View>
          <Image
            source={{uri: selectedImage.path}}
            // width={Dimensions.get("window").width}

            style={{width: win.width, height: win.width}}></Image>
        </View>
      );
    } else {
      return null;
    }
  };

  const ProcessButton = () => {
    if (selectedImage) {
      return (
        <Button
          color="red"
          title="Process Image"
          onPress={() =>
            inferImage(
              selectedImage.path,
              parseInt(outputWidth),

              setSelectedImage,
            )
          }
        />
      );
    } else {
      return null;
    }
  };
  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  const savePicture = async path => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    console.log("===============");
    const result =await CameraRoll.save(path);
    console.log(result);
  };
  const SaveButton =  () => {
    if (selectedImage != undefined && selectedImage.hasOwnProperty('fake')) {
      return (
        <Button
          title="Save Image"
          onPress={() => savePicture(selectedImage.path)}
        />
      );
    } else {
      return null;
    }
  };
  return (
    <View style={common.container}>
      <Button
        color="green"
        title="Take Picture"
        onPress={() => openImagePickerAsync(setSelectedImage)}
      />

      <Button
        title="Select Image"
        onPress={() => openImagePickerAsync(setSelectedImage, false)}
      />

      <ImageToProcess />
      {/* <TextInput
        style={{height: 50}}
        onChangeText={onChangeNumber}
        value={outputWidth}
        placeholder="Output Width"
        keyboardType="numeric"
      /> */}
      <ProcessButton />

      <SaveButton />
    </View>
  );
};

const openImagePickerAsync = async (setSelectedImage, camera = true) => {
  // You can also use as a promise without 'callback':

  let result;
  if (camera) {
    // const options = {
    //   selectionLimit: 1,
    //   cameraType: 'back',
    //   includeBase64: false,
    // };
    // result = await launchCamera(options);
    const options = {
      width: 650,
      height: 650,
      cropping: true,
      mediaType: 'photo',
      enableRotationGesture: true,
    };
    result = await ImagePicker.openCamera(options);
    console.log(result);
  } else {
    // const options = {
    //   selectionLimit: 1,
    //   mediaType: 'photo',
    //   includeBase64: false,
    // };
    // result = await launchImageLibrary(options);
    const options = {
      width: 650,
      height: 650,
      cropping: true,
      mediaType: 'photo',
      enableRotationGesture: true,
    };
    result = await ImagePicker.openPicker(options);
    console.log(result);
    console.log(result.path);
  }

  if (!result.didCancel) {
    setSelectedImage(result);
  }
};
const win = Dimensions.get('window');

export default HomeScreen;
