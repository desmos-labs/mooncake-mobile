import { makeStyleWithProps } from 'config/theme';
import { RefObject } from 'react';
import { Dimensions, TextInput } from 'react-native';
import { PROFILE_HEADER_HEIGHT } from 'screens/Profile/useStyles';

type Props = {
  nicknameInputRef: RefObject<TextInput>;
  dTagInputRef: RefObject<TextInput>;
  bioInputRef: RefObject<TextInput>;
};

const useStyles = makeStyleWithProps(
  ({ nicknameInputRef, dTagInputRef, bioInputRef }: Props, theme) => ({
    container: {
      flex: 1,
    },
    headerText: {
      marginTop: 60,
      textAlign: 'center',
      alignItems: 'center',
      paddingBottom: theme.spacing.xs,
    },
    headerButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      zIndex: 2,
    },
    coverPicBackground: {
      height: PROFILE_HEADER_HEIGHT,
      position: 'absolute',
      width: Dimensions.get('window').width,
      zIndex: 1,
    },
    icon: { width: 24, height: 24 },

    scrollView: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    card: {
      paddingHorizontal: theme.spacing.m,
    },
    buttonGroup: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    inputLabel: {
      marginVertical: theme.spacing.s,
    },
    descriptionText: {
      marginBottom: theme.spacing.m,
    },
    topButton: {
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },
    kbView: {
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: theme.colors.white,
      zIndex: 2,
      marginTop: 60,
    },
    scrollContainer: {
      flex: 1,
      marginTop: theme.spacing.xs,
    },
    bioInput: {
      height: 180,
      alignSelf: 'flex-start',
      textAlignVertical: 'top',
      paddingTop: 8,
    },
    bioDTextInput: {
      borderWidth: 1,
      borderColor: theme.colors.lightGrey01,
    },
    errorText: {
      color: theme.colors.pink01,
      flex: 1,
    },
    nickname: {
      opacity: nicknameInputRef.current?.isFocused() ? 1 : 0,
    },
    dTag: {
      opacity: dTagInputRef.current?.isFocused() ? 1 : 0,
    },
    bio: {
      opacity: bioInputRef.current?.isFocused() ? 1 : 0,
    },
  }),
);

export default useStyles;
