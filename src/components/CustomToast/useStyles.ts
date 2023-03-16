import { makeStyleWithProps } from 'config/theme';
import ToastConfig from 'config/ToastConfig';

const useStyles = makeStyleWithProps((toastType: ToastConfig, theme) => ({
  commonToastStyle: {
    width: '95%',
    top: 18,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11.5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor:
      toastType === ToastConfig.SUCCESS ? 'rgba(30, 196, 144, 1)' : 'rgba(249, 172, 212, 1)',
    backgroundColor:
      toastType === ToastConfig.SUCCESS ? 'rgba(241, 255, 225, 1)' : 'rgba(255, 242, 249, 1)',
    margin: 6,
  },
  topToastStyle: {
    top: 0,
  },
  bottomToastStyle: {
    bottom: 0,
  },
  textGroup: {
    justifyContent: 'center',
  },
  button: {
    right: 0,
    marginLeft: 'auto',
  },
  success: {
    backgroundColor: theme.colors.accentGreen01,
    borderColor: theme.colors.accentGreen02,
  },
  failure: {
    backgroundColor: theme.colors.pink03,
    borderColor: theme.colors.pink02,
  },
}));

export default useStyles;
