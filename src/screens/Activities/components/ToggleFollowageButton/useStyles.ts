import { makeStyleWithProps } from 'config/theme';
import { NotificationButtonProps } from 'screens/Activities/components/ToggleFollowageButton/index';

const useStyles = makeStyleWithProps((props: NotificationButtonProps, theme) => ({
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
  },
}));

export default useStyles;
