import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './reducer/store';
import { View, StyleSheet } from 'react-native';
import Navigation from './navigation/Navigation';
import * as Font from 'expo-font';
import { colors } from './utils/colors';
import 'react-native-get-random-values';
import { NativeBaseProvider } from 'native-base';
import { GlobalProvider } from './context/GlobalContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    surface: 'white',
  },
};

const fetchFonts = async () => {
  await Font.loadAsync({
    'montserrat-regular': require('./assets/fonts/static/Montserrat-Regular.ttf'),
    'montserrat-bold': require('./assets/fonts/static/Montserrat-SemiBold.ttf'),
    'Montserrat-SemiBold': require('./assets/fonts/static/Montserrat-SemiBold.ttf'),

  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await fetchFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NativeBaseProvider>
       <Provider store={store}>
        <PaperProvider theme={theme}>
          <StatusBar style="dark" backgroundColor="white" />
           <NavigationContainer>
            <GlobalProvider>
              <Navigation />
            </GlobalProvider>
          </NavigationContainer>
        </PaperProvider>
    </Provider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
