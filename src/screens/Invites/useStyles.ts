import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  iconLeft: {width: 18, height: 18, marginLeft: 4},
  iconRight: {width: 18, height: 18, marginRight: 4},
  banner: {
    width: 375,
    height: 375,
    marginTop: -60,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  copyIcon: {
    margin: theme.spacing.m,
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  copyButton: {
    borderColor: theme.colors.lightGrey01,
    borderLeftWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  inviteContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    borderColor: theme.colors.lightGrey01,
    borderWidth: 1,
    marginBottom: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inviteText: {
    alignSelf: 'center',
    marginHorizontal: theme.spacing.s,
    marginVertical: theme.spacing.m,
  },
  subtitleContainer: {padding: theme.spacing.m, alignItems: 'center'},
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
}));

export default useStyles;
