import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: theme.spacing.m,
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
    paddingVertical: theme.spacing.m,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  profileGroup: {
    flexDirection: 'row',
  },
  profileText: {
    color: theme.colors.font[5],
  },
  textStyle: {
    color: theme.colors.font[5],
    fontSize: 32,
  },
  blankAvatar: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundGray,
  },
  nameGroup: {
    marginLeft: theme.spacing.s,
    justifyContent: 'center',
  },
}));

export default useStyles;
