import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  commonToastStyle: {
    height: 60,
    borderRadius: 8,
    margin: 8,
    padding: 16,
    /*    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8, */
    position: 'absolute',
    right: 0,
    left: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
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
    backgroundColor: theme.colors.green03,
    borderColor: theme.colors.green01,
  },
  failure: {
    backgroundColor: theme.colors.pink03,
    borderColor: theme.colors.pink02,
  },
}));

export default useStyles;
