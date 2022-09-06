import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    borderRadius: 18,
    backgroundColor: theme.colors.butterYellow01,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '95%',
    height: '100%',
    alignSelf: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.l,
    ...StyleSheet.absoluteFillObject,
  },
  bottomGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: theme.spacing.m,
  },
  profileGroup: {
    flexDirection: 'row',
  },
  profileText: {
    color: theme.colors.white,
  },
  textStyle: {
    color: theme.colors.white,
    fontSize: 32,
  },
  imagePostText: {
    marginTop: theme.spacing.s,
    color: theme.colors.white,
    marginRight: theme.spacing.s,
  },
  blankAvatar: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundGrey,
  },
  nameGroup: {
    marginLeft: theme.spacing.s,
    justifyContent: 'center',
  },
  textGradient: {
    ...StyleSheet.absoluteFillObject,
    top: -25,
  },
}));

export default useStyles;
