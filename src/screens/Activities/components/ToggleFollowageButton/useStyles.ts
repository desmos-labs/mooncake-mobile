import { makeStyleWithProps } from 'config/theme';
import { NotificationButtonProps } from 'screens/Activities/components/ToggleFollowageButton/index';

const useStyles = makeStyleWithProps((props: NotificationButtonProps, theme) => ({
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  button: {
    minWidth: 86,
    height: 34,
    justifyContent: 'center',
  },
  buttonText: {
    color: props.isFollowingAddress ? undefined : theme.colors.white,
    alignSelf: 'center',
  },
}));

export default useStyles;
