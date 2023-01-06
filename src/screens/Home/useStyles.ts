import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  homeView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.m,
  },
  flatlist: {
    flex: 1,
  },
  flatlistInner: {
    flexGrow: 1,
  },
  lottieView: {width: '10%', alignSelf: 'center'},
  lottieOuterView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
}));

export default useStyles;
