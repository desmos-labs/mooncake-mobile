import { makeStyleWithProps } from 'config/theme';
import { Props } from './index';

const useStyles = makeStyleWithProps((props: Props) => ({
  baseButtonStyle: {
    opacity: props.disabled ? 0.3 : 1,
  },
}));

export default useStyles;
