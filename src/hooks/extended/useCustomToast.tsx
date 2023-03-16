import React from 'react';
import { useToast } from 'native-base';
import { InterfaceToastProps } from 'native-base/lib/typescript/components/composites/Toast';
import CustomToast from 'components/CustomToast';
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
  message: string;

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
  const toast = useToast();

  const showToast = React.useCallback(
    (type: ToastConfig, options: ShowToastOptions | ShowErrorToastOptions, id?: string) => {
      const toastId = generateToastId(id);

      if (toast.isActive(toastId)) return;

      toast.show({
        ...BaseToastConfig,
        id: toastId,
        render: () => <CustomToast type={type} options={options} />,
      });
    },
    [toast],
  );

  const success = React.useCallback(
    (options: ShowToastOptions, id?: string) => {
      showToast(ToastConfig.SUCCESS, options, id);
    },
    [showToast],
  );

  const error = React.useCallback(
    (options: ShowErrorToastOptions, id?: string) => {
      showToast(ToastConfig.ERROR, options, id);
    },
    [showToast],
  );

  const errorNoRetry = React.useCallback(
    (options: ShowToastOptions, id?: string) => {
      showToast(ToastConfig.ERROR_NO_RETRY, options, id);
    },
    [showToast],
  );

  return {
    success,
    error,
    errorNoRetry,
  };
};

export default useCustomToast;
