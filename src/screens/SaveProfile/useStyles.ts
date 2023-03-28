import { makeStyleWithProps } from 'config/theme';
import { RefObject } from 'react';
import { TextInput } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

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
    headerButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      top: theme.spacing.m,
      paddingHorizontal: theme.spacing.m,
    },
    bannerImage: {
      width: '100%',
      height: verticalScale(230),
      resizeMode: 'cover',
      position: 'absolute',
      top: 0,
    },
    scrollView: {
      backgroundColor: theme.colors.white,
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
    inputStyle: {
      borderWidth: 1,
      borderColor: theme.colors.lightGrey01,
    },
    kbView: {
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: theme.colors.white,
    },
    scrollContainer: {
      flex: 1,
      marginTop: 60,
    },
    bioInput: {
      height: 160,
      alignSelf: 'flex-start',
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
