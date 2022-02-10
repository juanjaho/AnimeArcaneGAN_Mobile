import React, {useEffect} from 'react';
import {Button, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {StyleSheet} from 'react-native';
function LoadingScreen(props) {

  return (
    <Modal
      testID={'modal'}
      isVisible={props.isLoadingScreen}
     
      style={styles.view}>
      <DefaultModalContent onPress={() => props.setIsLoadingScreen(false)} />
    </Modal>
  );
}
const DefaultModalContent = props => (
  <View style={styles.content}>
    <Text style={styles.contentTitle}>Processing image</Text>
    <Text style={styles.contentTitle}>⌛</Text>
    
    {/* <Button testID={'close-button'} onPress={props.onPress} title="Close" color={'black'}/> */}
  </View>
);
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    margin: 0,
  },
  content: {
    // backgroundColor: '#171717',
    // backgroundColor: 'green',
    // padding: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
export default LoadingScreen;
