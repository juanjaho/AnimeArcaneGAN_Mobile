import {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import React from 'react';
import common from '../styles/Common';
import inferImage from '../api/Inference';
// import CameraRoll from '@react-native-community/cameraroll';
const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState();
  const [outputWidth, onChangeNumber] = React.useState('640');
  useEffect(() => {
    if (selectedImage) {
      onChangeNumber(selectedImage.width.toString());
    }
  }, [selectedImage]);
  const ImageToProcess = () => {
    if (selectedImage) {
      return (
        <View>
          <Image
            source={{uri: selectedImage.uri}}
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
          title="Process Image"
          onPress={() =>
            inferImage(
              selectedImage.uri,
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

  const SaveButton = () => {
    if (selectedImage != undefined && selectedImage.hasOwnProperty('fake')) {
      return (
        <Button
          title="Save Image"
          // onPress={() => CameraRoll.save(selectedImage.uri)}
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
      <TextInput
        style={{height: 50}}
        onChangeText={onChangeNumber}
        value={outputWidth}
        placeholder="Output Width"
        keyboardType="numeric"
      />
      <ProcessButton />

      <SaveButton />
    </View>
  );
};

const openImagePickerAsync = async (setSelectedImage, camera = true) => {
  // You can also use as a promise without 'callback':

  let result;
  if (camera) {
    const options = {
      selectionLimit: 1,
      cameraType: 'back',
      includeBase64: false,
    };
    result = await launchCamera(options);
  } else {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    result = await launchImageLibrary(options);
  }

  if (!result.didCancel) {
    setSelectedImage(result.assets[0]);
  }

  // setSelectedImage(pickerResult);
};
const win = Dimensions.get('window');
const styles = StyleSheet.create({
  /* Other styles hidden to keep the example brief... */
  thumbnail: {
    maxHeight: win.height / 1.7,
  },
});

export default HomeScreen;
