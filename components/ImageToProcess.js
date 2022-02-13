import {View,Dimensions, Image, Text} from 'react-native';
import React from 'react';
import common from '../styles/Common';


const win = Dimensions.get('window');
const ImageToProcess = (props) => {
  if (props.selectedImage) {
    return (
      <View style={common.image}>
        <Image
          source={{uri: props.selectedImage.path}}
          style={{
            width: win.width,
            height: win.width,
            aspectRatio: props.selectedImage.width / props.selectedImage.height,
          }}
        />
      </View>
    );
  } else {
    return null;
  }
};


export default ImageToProcess