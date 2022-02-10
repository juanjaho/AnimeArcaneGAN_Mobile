import {useState, useEffect} from 'react';
import {View, Button, Dimensions, Image,Text} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React from 'react';
import common from '../styles/Common';
import inferImage from '../api/Inference';
import SaveScreen from '../components/SaveScreen';
import LoadingScreen from '../components/LoadingScreen';
import SliderOutputMax from '../components/SliderOutputMax';
import SaveButton from '../components/SaveButton.js';
const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState();
  const [outputMax, setOutputMax] = React.useState(650);
  const [isSaveScreen, setIsSaveScreen] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  // useEffect(() => {
  //   if (isLoadingScreen == true) {
  //     inferImage(
  //       selectedImage.path,
  //       outputMax,
  //       setSelectedImage,
  //       setIsLoadingScreen,
  //     );
  //   }
  // }, [isLoadingScreen]);
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
            }}
          />
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
          onPress={() => {
            setIsLoadingScreen(true);

            inferImage(
              selectedImage.path,
              outputMax,
              setSelectedImage,
              setIsLoadingScreen,
            );
          }}
        />
      );
    } else {
      return null;
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

      <SliderOutputMax
        min={100}
        max={1400}
        step={100}
        snapped={true}
        outputMax={outputMax}
        setOutputMax={setOutputMax}
        selectedImage={selectedImage}
      />

      <ProcessButton />

      <SaveButton
        selectedImage={selectedImage}
        setIsSaveScreen={setIsSaveScreen}
      />
      <SaveScreen
        isSaveScreen={isSaveScreen}
        setIsSaveScreen={setIsSaveScreen}
      />
      <LoadingScreen
        isLoadingScreen={isLoadingScreen}
        setIsLoadingScreen={setIsLoadingScreen}
      />
      {/* <Text >{isLoadingScreen && <Text>hallo</Text>}</Text> */}
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
