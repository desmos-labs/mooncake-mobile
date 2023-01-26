import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  followButton: {
    minWidth: 86,
    height: 34,
    justifyContent: 'center',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  followText: {color: theme.colors.white, alignSelf: 'center'},
}));

export default useStyles;
