import React from 'react';
import {NativeModules} from 'react-native';


const {ModelDataHandler} = NativeModules;
const inferImage = async (
  image: any ,
  outputMax: Number,
  setImage: any,
  setIsLoadingScreen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedModel: string,
) => {

  const result =  await ModelDataHandler.pyprocess(image.path, selectedModel,outputMax);
  setIsLoadingScreen(false);
  return setImage({
    path: result + '?' + Date.now(),
    width: image.width,
    height: image.height,
    fake: true,
  });
};
export default inferImage;
