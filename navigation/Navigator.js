import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
/// App导航路由栈
import React from 'react';
import HomeScene from '../Scene/HomeScene';
import UserScene from '../Scene/UserScene';
import HappyScene from '../Scene/HappyScene';
import ModalScene from '../Scene/ModalScene';




// Tab Navigator
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScene} />
      <Tab.Screen name="User" component={UserScene} />
    </Tab.Navigator>
  );
}

// Stack Navigators 
const Stack = createStackNavigator();

function HappyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Happy" component={HappyScene} options={{ headerShown: false }} />
    </Stack.Navigator> 
  );
}

const AppStack = (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="Happy" component={HappyStack} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScene} />  
      </Stack.Group>    
    </Stack.Navigator>
) 
const Navigation = () => {
  return (
    <NavigationContainer>
      {AppStack}
    </NavigationContainer>
  );
}
export default Navigation;