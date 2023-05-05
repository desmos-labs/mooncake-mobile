import React from 'react';
import { Toast } from 'native-base';
import { InterfaceToastProps } from 'native-base/lib/typescript/components/composites/Toast';
import CustomToast from 'components/Toasts/CustomToast';
import { v4 as uuidV4 } from 'uuid';

/**
 * Enums that represent the possible types of toasts
 */
export enum ToastConfig {
  SUCCESS = 'BUTTER_SUCCESS',
  ERROR = 'BUTTER_ERROR',
  ERROR_NO_RETRY = 'BUTTER_ERROR_NO_RETRY',
}

/**
 * Toast options for SUCCESS and ERROR_NO_RETRY toasts
 */
interface ShowToastOptions {
  id?: string;
  handlePressToast?: () => void;
}

/**
 * Toast options for ERROR toasts
 * extends {@link ShowToastOptions}
 */
interface ShowErrorToastOptions extends ShowToastOptions {
  handlePressRetry: () => void;
}

/**
 * Utility function to centralized id generation for toasts.
 */
const generateToastId = (id?: string) => id || uuidV4();

/**
 * Default toast config.
 */
const BaseToastConfig: Pick<InterfaceToastProps, 'placement' | 'duration'> = {
  duration: 5000,

  placement: 'top',
};

/**
 * A hook that wraps the toast logic of native-base and exposes a set of pre-configured functions
 * to make toasts more consistent across the application.
 */
const useCustomToast = () => {
  const showToast = React.useCallback(
    (type: ToastConfig, message: string, options: ShowToastOptions | ShowErrorToastOptions) => {
      const toastId = generateToastId(options.id);

      if (Toast.isActive(toastId)) return;

      Toast.show({
        ...BaseToastConfig,
        id: toastId,
        render: () => (
          <CustomToast message={message} type={type} options={{ ...options, id: toastId }} />
        ),
      });
    },
    [],
  );

  const success = React.useCallback(
    (message: string, options?: ShowToastOptions) => {
      showToast(ToastConfig.SUCCESS, message, options || {});
    },
    [showToast],
  );

  const error = React.useCallback(
    (message: string, options?: ShowErrorToastOptions) => {
      showToast(ToastConfig.ERROR, message, options || {});
    },
    [showToast],
  );

  const errorNoRetry = React.useCallback(
    (message: string, options?: ShowToastOptions) => {
      showToast(ToastConfig.ERROR_NO_RETRY, message, options || {});
    },
    [showToast],
  );

  const closeAll = () => Toast.closeAll();

  return {
    success,
    error,
    errorNoRetry,
    closeAll,
  };
};

export default useCustomToast;
