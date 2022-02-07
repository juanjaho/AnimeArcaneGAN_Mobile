import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";

import common from "../styles/Common";

const ProfileScreen = ({ navigation, route }) => {
  const [count, setCount] = useState(0);

  return (
    <View style={common.container}>
      <Text>This is {route.params.name}'s profile</Text>
      <Text>You clicked {count} times</Text>
   
      <Button onPress={() => setCount(count + 7)} title="Click me!" />
    </View>
  );
};



export default ProfileScreen