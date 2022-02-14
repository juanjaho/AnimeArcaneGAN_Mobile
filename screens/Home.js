import {useState, useEffect} from 'react';
import {View, Button, Dimensions, Image, Text} from 'react-native';
import React from 'react';
import common from '../styles/Common';
import SaveScreen from '../components/SaveScreen';
import LoadingScreen from '../components/LoadingScreen';
import SliderOutputMax from '../components/SliderOutputMax';
import SaveButton from '../components/SaveButton.js';
import ImageToProcess from '../components/ImageToProcess';
import ProcessButton from '../components/ProcessButton';
import openImagePickerAsync from '../components/openImagePickerAsync';
import ModelPicker from '../components/ModelPicker';
const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState();
  const [outputMax, setOutputMax] = React.useState(650);
  const [isSaveScreen, setIsSaveScreen] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("face_paint_512_v2.ptl");
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
      <ModelPicker
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <ImageToProcess selectedImage={selectedImage} />
      <SliderOutputMax
        min={100}
        max={1400}
        step={10}
        snapped={true}
        outputMax={outputMax}
        setOutputMax={setOutputMax}
        selectedImage={selectedImage}
      />

      <ProcessButton
        selectedImage={selectedImage}
        outputMax={outputMax}
        setSelectedImage={setSelectedImage}
        setIsLoadingScreen={setIsLoadingScreen}
        selectedModel={selectedModel}
      />

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
    </View>
  );
};

export default HomeScreen;
