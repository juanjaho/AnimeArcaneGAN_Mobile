import React from 'react';
import {NavigationContainer,DefaultTheme,DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import HomeScreen from './screens/Home';

const Stack = createNativeStackNavigator();

const App = () => {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'AnimeGAN_Mobile'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
