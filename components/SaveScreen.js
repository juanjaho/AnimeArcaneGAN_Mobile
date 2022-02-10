import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {StyleSheet} from 'react-native';
function SaveScreen(props) {
  return (
    <Modal
      testID={'modal'}
      isVisible={props.isSaveScreen}
      onSwipeComplete={() => props.setIsSaveScreen(false)}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.view}
      onBackdropPress={() => props.setIsSaveScreen(false)}>
      <DefaultModalContent onPress={() => props.setIsSaveScreen(false)} />
    </Modal>
  );
}
const DefaultModalContent = props => (
  <View style={styles.content}>
    <Text style={styles.contentTitle}>Saved Successfully 👋!</Text>
    {/* <Button testID={'close-button'} onPress={props.onPress} title="Close" color={'black'}/> */}
  </View>
);
const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: '#171717',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
export default SaveScreen;
