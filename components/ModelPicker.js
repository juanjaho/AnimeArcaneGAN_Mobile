import {Picker} from '@react-native-picker/picker';
import React from 'react';
import common from '../styles/Common';
const ModelPicker = props => {
  return (
    <Picker 
    // itemStyle={{alignItems:'center',justifyContent:"center"}}
      // itemStyle={common.container}
      mode="dropdown"
      selectedValue={props.selectedModel}
      onValueChange={(itemValue, itemIndex) =>
        props.setSelectedModel(itemValue)
      }>
      <Picker.Item label="FaceModel" value="faceModel.ort" />
      <Picker.Item label="BackgroundPaprika" value="paprika.ort" />
      {/* <Picker.Item label="BackgroudnV3" value="backgroundV3.ort" /> */}
    </Picker>
  );
};
export default ModelPicker;
