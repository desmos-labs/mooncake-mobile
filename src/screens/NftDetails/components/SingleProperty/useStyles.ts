import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  buttonContainer: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(239, 239, 239, 1)',
    borderBottomWidth: 1,
  },
  textGroup: {padding: 12},
}));

export default useStyles;
