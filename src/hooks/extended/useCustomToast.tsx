import React from 'react';
import { Toast } from 'native-base';
import { InterfaceToastProps } from 'native-base/lib/typescript/components/composites/Toast';
import CustomToast from 'components/Toasts/CustomToast';
import { v4 as uuidV4 } from 'uuid';
import NewPostToast from 'components/Toasts/NewPostToast';

/**
 * Enums that represent the possible types of toasts
 */
export enum ToastConfig {
  SUCCESS = 'BUTTER_SUCCESS',
  ERROR = 'BUTTER_ERROR',
  ERROR_NO_RETRY = 'BUTTER_ERROR_NO_RETRY',
  NEW_POST = 'NEW_POST',
}

/**
 * Toast options for SUCCESS and ERROR_NO_RETRY toasts
 */
interface CustomSuccessToastOptions {
  id?: string;
  handlePressToast?: () => void;
}

/**
 * Toast options for ERROR toasts
 * extends {@link CustomSuccessToastOptions}
 */
interface CustomErrorToastOptions extends CustomSuccessToastOptions {
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
    ({
      type,
      message,
      options,
      additionalToastOptions,
    }: {
      type: ToastConfig;
      message?: string;
      options?: CustomSuccessToastOptions | CustomErrorToastOptions;
      additionalToastOptions?: InterfaceToastProps;
    }) => {
      const toastId = generateToastId(options?.id);

      if (Toast.isActive(toastId)) return;

      Toast.show({
        ...BaseToastConfig,
        ...additionalToastOptions,
        id: toastId,
        render: () => {
          switch (type) {
            case ToastConfig.NEW_POST:
              return <NewPostToast />;
            default:
              return (
                // false positive
                // @ts-ignore
                <CustomToast message={message} type={type} options={{ ...options, id: toastId }} />
              );
          }
        },
      });
    },
    [],
  );

  const success = React.useCallback(
    (message: string, options?: CustomSuccessToastOptions) => {
      showToast({
        type: ToastConfig.SUCCESS,
        message,
        options,
      });
    },
    [showToast],
  );

  const error = React.useCallback(
    (message: string, options?: CustomErrorToastOptions) => {
      showToast({
        type: ToastConfig.ERROR,
        message,
        options,
      });
    },
    [showToast],
  );

  const errorNoRetry = React.useCallback(
    (message: string, options?: CustomSuccessToastOptions) => {
      showToast({
        type: ToastConfig.ERROR_NO_RETRY,
        message,
        options,
      });
    },
    [showToast],
  );

  const newPost = React.useCallback(
    (options?: CustomSuccessToastOptions) => {
      showToast({
        type: ToastConfig.NEW_POST,
        options: {
          // use a hard-coded toast id to ensure it is only shown once at any given instance
          id: 'new-post-toast',
          ...options,
        },
        additionalToastOptions: {
          // a null duration means the toast will not dismiss automatically
          duration: null,
        },
      });
    },
    [showToast],
  );

  const closeAll = () => Toast.closeAll();

  return {
    success,
    error,
    errorNoRetry,
    closeAll,
    newPost,
  };
};

export default useCustomToast;
