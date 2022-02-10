import {View, Text} from 'react-native';
import React from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
const SliderOutputMax = (props) => {

  const [runningOutputMax, setRunningOutputMax] = React.useState(props.outputMax);
  if (props.selectedImage != undefined) {
    return (
      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text>
          Max Dimension: {runningOutputMax}px X {runningOutputMax}px{' '}
        </Text>
        <MultiSlider
          values={[runningOutputMax]}
          min={props.min}
          max={props.max}
          step={props.step}
          snapped={props.snapped}
          onValuesChange={e => {
            setRunningOutputMax(e[0]);
          }}
          onValuesChangeFinish={e => {
            props.setOutputMax(e[0]);
          }}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default SliderOutputMax