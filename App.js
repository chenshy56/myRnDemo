import React from 'react';
import  Navigation  from './navigation/Navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  return (
    <SafeAreaProvider>
        <Navigation />
    </SafeAreaProvider>
  );
};
export default App;