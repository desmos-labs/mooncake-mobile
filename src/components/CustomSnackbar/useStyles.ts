import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  commonToastStyle: {
    top: 10,
    height: 60,
    borderRadius: 8,
    margin: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'red',
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
