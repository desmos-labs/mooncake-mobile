import Toasts from 'components/Toasts';
import React from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

export enum ToastType {
  success = 'success',
  error = 'error',
  loading = 'loading',
  oneButton = 'oneButton',
  info = 'info',
}

interface CommonToastProps {
  readonly message: string;
  readonly toastType: ToastType;
}

interface SimpleToastProps extends CommonToastProps {
  readonly title: string;
  readonly toastType: ToastType.success | ToastType.error;
}

interface ErrorToastProps extends CommonToastProps {
  readonly toastType: ToastType.error;
  readonly title: string;
  readonly retryAction?: () => void;
  readonly retryLabel?: string;
}

interface LoadingToastProps extends CommonToastProps {
  readonly toastType: ToastType.loading;
}

interface OneButtonToastProps extends CommonToastProps {
  readonly toastType: ToastType.oneButton;
  readonly title?: string;
  readonly buttonLabel: string;
  readonly buttonAction: () => void;
}

interface InfoToastProps extends CommonToastProps {
  readonly toastType: ToastType.info;
  readonly title?: string;
}

export type ToastProps =
  | SimpleToastProps
  | ErrorToastProps
  | LoadingToastProps
  | OneButtonToastProps
  | InfoToastProps;

/**
 * Utility function to wrap an action in a function that hides the toast
 * before executing the action.
 */
const wrapActionWitHide = (action?: () => void) => {
  if (action) {
    return () => {
      Toast.hide();
      action();
    };
  } else {
    return undefined;
  }
};

const toastStyles = StyleSheet.create({
  root: {
    width: '90%',
  },
});

const toastConfig = {
  [ToastType.success]: ({ props }: { props: SimpleToastProps }) => {
    return <Toasts.Success style={toastStyles.root} title={props.title} message={props.message} />;
  },
  [ToastType.error]: ({ props }: { props: ErrorToastProps }) => {
    return (
      <Toasts.Error
        style={toastStyles.root}
        title={props.title}
        message={props.message}
        action={wrapActionWitHide(props.retryAction)}
        actionLabel={props.retryAction ? props.retryLabel ?? 'Retry' : undefined}
      />
    );
  },
  [ToastType.loading]: ({ props }: { props: LoadingToastProps }) => {
    return <Toasts.Success style={toastStyles.root} message={props.message} showLoadingAnimation />;
  },
  [ToastType.oneButton]: ({ props }: { props: OneButtonToastProps }) => {
    return (
      <Toasts.Success
        style={toastStyles.root}
        title={props.title}
        message={props.message}
        actionLabel={props.buttonLabel}
        action={wrapActionWitHide(props.buttonAction)}
      />
    );
  },
  [ToastType.info]: ({ props }: { props: InfoToastProps }) => {
    return <Toasts.Success style={toastStyles.root} title={props.title} message={props.message} />;
  },
};

export default toastConfig;
