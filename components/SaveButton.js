import {Button, PermissionsAndroid, Platform} from 'react-native';
import React from 'react';
import CameraRoll from '@react-native-community/cameraroll';
const SaveButton = props => {
  if (
    props.selectedImage != undefined &&
    props.selectedImage.hasOwnProperty('fake')
  ) {
    return (
      <Button
        color="#171717"
        title="Save Image"
        onPress={() => savePicture(props.selectedImage.path,props)}
      />
    );
  } else {
    return null;
  }
};
const hasAndroidPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};
const savePicture = async (path,props) => {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }
  const result = await CameraRoll.save(path);
  if (result) {
    props.setIsSaveScreen(true);
  }
};
export default SaveButton;
