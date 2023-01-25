import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  followButton: {
    minWidth: 86,
    height: 34,
    justifyContent: 'center',
  },
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
}));

export default useStyles;
