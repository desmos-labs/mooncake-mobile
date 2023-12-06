import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import Toast from 'react-native-toast-message';
import { CustomThemeType, lightTheme } from 'config/theme/LightTheme';
import Typography from 'components/Typography';
import { loadingYellow } from 'assets/animations';
import Button from 'components/Button';
import NamedStyles = StyleSheet.NamedStyles;

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
    const styles = makeStyles(props.theme ?? lightTheme);
    return (
      <View style={styles.success}>
        <Typography.H6 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.title || 'Success'}
        </Typography.H6>
        <Typography.Body1 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.message}
        </Typography.Body1>
      </View>
    );
  },
  error: ({ props }: { props: ThemedToastProps<SimpleToastProps> }) => {
    const styles = makeStyles(props.theme ?? lightTheme);
    return (
      <View style={styles.error}>
        <Typography.H6 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.title || 'Error'}
        </Typography.H6>
        <Typography.Body1 style={{ color: (props.theme ?? lightTheme).colors.black }}>
          {props.message}
        </Typography.Body1>
      </View>
    );
  },

  loading: ({ props }: { props: ThemedToastProps<LoadingToastProps> }) => {
    const styles = makeStyles(props.theme ?? lightTheme);
    return (
      <View style={[styles.info, styles.infoInline]}>
        <Typography.Body1 style={styles.loadingText}>{props.message}</Typography.Body1>
        <View style={styles.flex} />
        <Image source={loadingYellow} style={styles.loadingImage as ImageStyle} />
      </View>
    );
  },
  oneButton: ({ props }: { props: ThemedToastProps<OneButtonToastProps> }) => {
    const styles = makeStyles(props.theme ?? lightTheme);
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
        <View style={{ flex: 1 }} />
        <Button
          variant="text"
          onPress={() => {
            Toast.hide();
            props.buttonAction();
          }}
          style={styles.actionButton}>
          <Typography.Button1 style={{ color: (props.theme ?? lightTheme).colors.black }}>
            {props.buttonLabel}
          </Typography.Button1>
        </Button>
      </View>
    );
  },
  [ToastType.info]: ({ props }: { props: ThemedToastProps<InfoToastProps> }) => {
    const styles = makeStyles(props.theme ?? lightTheme);
    return (
      <View style={styles.info}>
        {props.title && <Typography.H6 style={styles.infoText}>{props.title}</Typography.H6>}
        <Typography.Body1 style={styles.infoText}>{props.message}</Typography.Body1>
      </View>
    );
  },
};

const makeStyles: (theme: CustomThemeType) => NamedStyles<any> = theme => ({
  success: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.butterOrange02,
    minHeight: 63,
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.butterOrange01,
    justifyContent: 'center',
  },
  error: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.accentRed01,
    minHeight: 63,
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.accentRed02,
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.butterOrange02,
    minHeight: 63,
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.butterOrange01,
    justifyContent: 'center',
  },
  infoInline: {
    alignItems: 'center',
    flexDirection: 'row',
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
    marginTop: -5,
  },
  onButtonContent: {
    flexShrink: 1,
  },
});

export default toastConfig;
