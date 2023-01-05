import {makeStyle} from 'config/theme';
import {Dimensions} from 'react-native';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    padding: theme.spacing.m,
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileText: {
    color: theme.colors.white,
  },
  textStyle: {
    // same as inputStyle in CreateTextPost/useStyles
    color: theme.colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: 0.0015,
    textAlign: 'center',
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
}));

export default useStyles;
