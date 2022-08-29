import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

const useStyles = () => {
  const theme = useTheme();
  const divider: StyleProp<ViewStyle> = {
    flexGrow: 1,
    margin: 10,
    height: 1,
    backgroundColor: 'rgb(239,239,239)',
  };
  const loadingContainer: StyleProp<ViewStyle> = {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 50,
    justifyContent: 'center',
    alignContent: 'center',
  };
  const errorContainer: StyleProp<ViewStyle> = {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderColor: 'rgb(248,170,212)',
    borderWidth: 1,
    backgroundColor: 'rgb(255,238,248)',
    borderRadius: 10,
    paddingRight: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  const errorMessage: StyleProp<ViewStyle> = {
    padding: 16,
  };
  const errorTitle: StyleProp<TextStyle> = {
    fontWeight: 'bold',
    fontSize: 15,
  };
  const errorText: StyleProp<TextStyle> = {
    fontSize: 13,
  };
  const retryButtonColor: string = theme.colors.text;
  const contentContainer: StyleProp<ViewStyle> = {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const pic: StyleProp<ViewStyle> = {
    flexGrow: 0,
    flexBasis: 50,
    justifyContent: 'center',
  };
  const title: StyleProp<TextStyle> = {
    fontWeight: '700',
    fontSize: 15,
    flexBasis: '100%',
  };
  const subtitle: StyleProp<TextStyle> = {};
  const followButton: TextStyle = {
    flexGrow: 0,
    flexBasis: 98,
    padding: 0,
    borderColor: theme.colors.primary,
  };
  const followButtonLabel: TextStyle = {
    fontSize: 12,
    color: '#ffffff',
  };
  const unfollowButton: TextStyle = {
    flexGrow: 0,
    flexBasis: 98,
    padding: 0,
    borderColor: theme.colors.primary,
  };
  const unfollowButtonLabel: TextStyle = {
    fontSize: 12,
    color: theme.colors.primary,
  };
  const names: StyleProp<ViewStyle> = {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };
  return {
    divider,
    loadingContainer,
    errorContainer,
    errorMessage,
    errorTitle,
    errorText,
    retryButtonColor,
    contentContainer,
    pic,
    title,
    subtitle,
    followButton,
    followButtonLabel,
    unfollowButton,
    unfollowButtonLabel,
    names,
  };
};

export default useStyles;
