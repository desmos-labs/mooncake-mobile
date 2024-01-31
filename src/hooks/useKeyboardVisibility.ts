import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEventName, Platform } from 'react-native';

/**
 * Hook to detect if the keyboard is visible or not
 * @returns {boolean} keyboardVisible
 */
const useKeyboardVisibility = () => {
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.select({
        // keyboardWillShow only works on ios
        ios: 'keyboardWillShow',
        android: 'keyboardDidShow',
      }) as KeyboardEventName,
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.select({
        ios: 'keyboardWillHide',
        android: 'keyboardDidHide',
      }) as KeyboardEventName,
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return {
    keyboardVisible,
  };
};

export default useKeyboardVisibility;
