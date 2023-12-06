import React from 'react';
import Toast from 'react-native-toast-message';
import { useTheme } from '@react-navigation/native';
import { ToastProps } from 'config/toast/toastConfig';

/**
 * Toast hook that provides a function to show a toast.
 */
const useToast = () => {
  // TODO: Bring this back
  // const isOnline = useAppStateValue('isOnline');
  const theme = useTheme();
  /**
   * Function to show a toast.
   * @param props - Toast props.
   */
  return React.useCallback(
    (props: ToastProps) => {
      // if (isOnline) {
      Toast.show({
        type: props.toastType,
        props: { ...props, theme },
      });
      // }
    },
    [theme],
  );
};

export default useToast;
