import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Dimensions,Platform,Image } from "react-native";
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import React from "react";
import common from "../styles/Common";
import inferImage from "../api/Inference";



const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState();
  useEffect(() => {
    console.log(selectedImage);
  });
  const ImageToProcess = () => {
    if (selectedImage) {
      return (
        <View>
          <Image
            source={{ uri: selectedImage.uri }}
            // width={Dimensions.get("window").width}
            
            style={{width:win.width,height:win.width}}
          ></Image>
          
          <Button
            title="Process Image"
            onPress={() => inferImage(selectedImage.uri, setSelectedImage)}
          />
        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <View style={common.container}>
      <Button
        color="green"
        title={Platform.OS}
        onPress={() => navigation.navigate("Profile", { name: "Jane" })}
      />

      <Button
        title="Select Image"
        onPress={() => openImagePickerAsync(setSelectedImage)}
      />
      <ImageToProcess />
    </View>
  );
};

const openImagePickerAsync = async (setSelectedImage) => {
  const options= {

    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  }
  const result = await launchImageLibrary(options);
  
  if (!result.didCancel){

    setSelectedImage(result.assets[0])
  }

  // setSelectedImage(pickerResult);
};
const win = Dimensions.get("window");
const styles = StyleSheet.create({
  /* Other styles hidden to keep the example brief... */
  thumbnail: {
    maxHeight:win.height/1.7

  },
});

export default HomeScreen;
