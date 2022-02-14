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
      <Picker.Item label="FaceModel" value="face_paint_512_v2.ptl" />
      <Picker.Item label="BackgroundPaprika" value="paprika.ptl" />
      <Picker.Item label="Arcane" value="ArcaneGANv0.3.ptl" />
    </Picker>
  );
};
export default ModelPicker;
