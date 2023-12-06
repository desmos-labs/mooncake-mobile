import { loadingYellow } from 'assets/animations';
import Button from 'components/Button';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import CommonStyles from 'config/theme/CommonStyles';
import { CustomThemeType, lightTheme } from 'config/theme/LightTheme';
import { ImageStyle } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

export enum ToastType {
  success = 'success',
  error = 'error',
  loading = 'loading',
  oneButton = 'oneButton',
  info = 'info',
}

export interface CommonToastProps {
  readonly message: string;
  readonly toastType: ToastType;
}

export interface SimpleToastProps extends CommonToastProps {
  readonly title: string;
  readonly toastType: ToastType.success | ToastType.error;
}

export interface LoadingToastProps extends CommonToastProps {
  readonly toastType: ToastType.loading;
}

export interface OneButtonToastProps extends CommonToastProps {
  readonly toastType: ToastType.oneButton;
  readonly title?: string;
  readonly buttonLabel: string;
  readonly buttonAction: () => void;
}

export interface InfoToastProps extends CommonToastProps {
  readonly toastType: ToastType.info;
  readonly title?: string;
}

export type ToastProps =
  | SimpleToastProps
  | LoadingToastProps
  | OneButtonToastProps
  | InfoToastProps;

type ThemedToastProps<T> = T & {
  theme?: CustomThemeType;
};

const toastConfig = {
  success: ({ props }: { props: ThemedToastProps<SimpleToastProps> }) => {
    const styles = makeStyles();
    return (
      <View style={styles.success}>
        <Typography.Subtitle3 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.title || 'Success'}
        </Typography.Subtitle3>
        <Typography.Body7 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.message}
        </Typography.Body7>
      </View>
    );
  },
  error: ({ props }: { props: ThemedToastProps<SimpleToastProps> }) => {
    const styles = makeStyles();
    return (
      <View style={styles.error}>
        <Typography.Subtitle3 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.title || 'Error'}
        </Typography.Subtitle3>
        <Typography.Body7 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.message}
        </Typography.Body7>
      </View>
    );
  },

  loading: ({ props }: { props: ThemedToastProps<LoadingToastProps> }) => {
    const styles = makeStyles();
    return (
      <View style={styles.loading}>
        <Typography.Subtitle3 style={styles.loadingText}>{props.message}</Typography.Subtitle3>
        <ThemedLottieView
          autoSize
          loop
          autoPlay
          source={loadingYellow}
          style={styles.loadingImage as ImageStyle}
        />
      </View>
    );
  },
  oneButton: ({ props }: { props: ThemedToastProps<OneButtonToastProps> }) => {
    const styles = makeStyles();
    return (
      <View style={[styles.info, styles.infoInline]}>
        <View style={styles.onButtonContent}>
          {props.title && (
            <Typography.H6 style={{ color: (props.theme ?? lightTheme).colors.black }}>
              {props.title}
            </Typography.H6>
          )}
          <Typography.Body1 style={{ color: (props.theme ?? lightTheme).colors.black }}>
            {props.message}
          </Typography.Body1>
        </View>
        <View style={CommonStyles.flex['1']} />
        <Button
          variant="text"
          onPress={() => {
            Toast.hide();
            props.buttonAction();
          }}>
          <Typography.Button1 style={{ color: (props.theme ?? lightTheme).colors.black }}>
            {props.buttonLabel}
          </Typography.Button1>
        </Button>
      </View>
    );
  },
  [ToastType.info]: ({ props }: { props: ThemedToastProps<InfoToastProps> }) => {
    const styles = makeStyles();
    return (
      <View style={styles.info}>
        {props.title && <Typography.H6 style={styles.infoText}>{props.title}</Typography.H6>}
        <Typography.Body1 style={styles.infoText}>{props.message}</Typography.Body1>
      </View>
    );
  },
};

const makeStyles = makeStyle(theme => ({
  success: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.toast.successBackground,
    minHeight: 45,
    width: '90%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.toast.successBorder,
    justifyContent: 'center',
  },
  error: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.toast.errorBackground,
    minHeight: 45,
    width: '90%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.toast.errorBorder,
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    minHeight: 45,
    width: '90%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.butterOrange01,
    justifyContent: 'center',
  },
  infoInline: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  loading: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.toast.successBackground,
    minHeight: 45,
    width: '90%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.toast.successBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  loadingText: {
    color: theme.colors.black,
    maxWidth: '75%',
  },
  infoText: {
    color: theme.colors.black,
  },
  loadingImage: {
    width: 32,
    height: 32,
  },
  onButtonContent: {
    flexShrink: 1,
  },
}));

export default toastConfig;
