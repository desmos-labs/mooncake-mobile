import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.m,
    paddingHorizontal: 80,
  },
  indicatorStyle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    resizeMode: 'contain',
    backgroundColor: '#FF844F',
  },
  tabButton: {
    flex: 1,
    alignSelf: 'center',
  },
}));

export default useStyles;
