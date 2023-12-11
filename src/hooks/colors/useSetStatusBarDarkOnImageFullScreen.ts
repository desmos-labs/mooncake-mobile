import { setStatusBarBackgroundColor, setStatusBarStyle, StatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const useSetStatusBarDarkOnImageFullScreen = (
  statusBarStyle: StatusBarStyle | undefined,
  isImageFullScreen: boolean,
) => {
  useEffect(() => {
    const initialStatusBarStyle = statusBarStyle;
    if (isImageFullScreen && statusBarStyle === 'dark') {
      setStatusBarStyle('light');
      Platform.OS === 'android' && setStatusBarBackgroundColor('black', false);
    }
    if (!isImageFullScreen && initialStatusBarStyle === 'dark') {
      setStatusBarStyle('dark');
    }
  }, [isImageFullScreen, statusBarStyle]);
};

export default useSetStatusBarDarkOnImageFullScreen;
