import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';
import { useCallback } from 'react';
import { Platform } from 'react-native';

const useSetStatusBarStyle = (statusBarStyle?: StatusBarStyle) => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          setStatusBarStyle('light');
        }, 200);
      } else {
        if (statusBarStyle) {
          setStatusBarStyle(statusBarStyle);
        }
      }
      return () => setStatusBarStyle('dark');
    }, [statusBarStyle]),
  );
};

export default useSetStatusBarStyle;
