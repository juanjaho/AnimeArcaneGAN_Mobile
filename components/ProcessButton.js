import {Button} from 'react-native';
import React from 'react';
import inferImage from '../api/Inference';
const ProcessButton = (props) => {
    if (props.selectedImage) {
      return (
        <Button
          color="#171717"
          title="Process Image"
          onPress={() => {
            props.setIsLoadingScreen(true);
            setTimeout(
              () =>
                inferImage(
                  props.selectedImage,
                  props.outputMax,
                  props.setSelectedImage,
                  props.setIsLoadingScreen,
                  props.selectedModel
                ),
              500,
            );
          }}
        />
      );
    } else {
      return null;
    }
  };

  export default ProcessButton