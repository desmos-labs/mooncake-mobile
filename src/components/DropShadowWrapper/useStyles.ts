import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  externalShadow: {
    flex: 1,
    width: '100%',
  },
  innerShadow: {
    width: '100%',
  },
}));

export default useStyles;
