import {useState} from 'react';
import {
  View,
  Button,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';
import React from 'react';
import common from '../styles/Common';
import inferImage from '../api/Inference';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ModalTester from '../components/ModalTester';
const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState();
  const [outputMax, setOutputMax] = React.useState(650);
  const [isModalVisible, setModalVisible] = useState(false);
  const ImageToProcess = () => {
    if (selectedImage) {
      return (
        <View style={common.image}>
          <Image
            source={{uri: selectedImage.path}}
            style={{
              width: win.width,
              height: win.width,
              aspectRatio: selectedImage.width / selectedImage.height,
            }}></Image>
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
          color="#171717"
          title="Process Image"
          onPress={() =>
            inferImage(selectedImage.path, outputMax, setSelectedImage)
          }
        />
      );
    } else {
      return null;
    }
  };
  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
  const savePicture = async path => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    const result = await CameraRoll.save(path);
    if (result) {
      setModalVisible(true);
    }
  };
  const SaveButton = () => {
    if (selectedImage != undefined && selectedImage.hasOwnProperty('fake')) {
      return (
        <Button
          color="#171717"
          title="Save Image"
          onPress={() => savePicture(selectedImage.path)}
        />
      );
    } else {
      return null;
    }
  };
  const SliderOutputMax = () => {
    // let runner = outputMax
    const [runningOutputMax, setRunningOutputMax] = React.useState(outputMax);
    if (selectedImage != undefined) {
      return (
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text>
            Max Dimension: {runningOutputMax}px X {runningOutputMax}px{' '}
          </Text>
          <MultiSlider
            values={[runningOutputMax]}
            min={500}
            max={800}
            step={25}
            snapped={true}
            onValuesChange={e => {
              setRunningOutputMax(e[0]);
            }}
            onValuesChangeFinish={e => {
              setOutputMax(e[0]);
            }}

            // onValuesChangeStart={this.disableScroll}
            // onValuesChangeFinish={this.enableScroll}
          />
        </View>
      );
    }else{
      return null
    }
  };
  return (
    <View style={common.container}>
      <Button
        color="#171717"
        title="Take Picture"
        onPress={() => openImagePickerAsync(setSelectedImage)}
      />

      <Button
        color="#171717"
        title="Select Image"
        onPress={() => openImagePickerAsync(setSelectedImage, false)}
      />
      <ImageToProcess />

      <SliderOutputMax />

      <ProcessButton />

      <SaveButton />
      <ModalTester
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const openImagePickerAsync = async (setSelectedImage, camera = true) => {
  // You can also use as a promise without 'callback':

  let result;
  const options = {
    
    cropping: true,
    mediaType: 'photo',
    enableRotationGesture: true,
    freeStyleCropEnabled: true,
  };
  if (camera) {
    result = await ImagePicker.openCamera(options);
  } else {
    result = await ImagePicker.openPicker(options);
  }

  if (!result.didCancel) {
    console.log(result);
    setSelectedImage(result);
  }
};
const win = Dimensions.get('window');

export default HomeScreen;
