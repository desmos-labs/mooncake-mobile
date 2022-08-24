import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => {
  return {
    postButton: {
      height: 30,
      width: 70,
      justifyContent: 'center',
      marginLeft: 12,
    },
    shadow: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    container: {flexDirection: 'row', width: '100%'},
    textInput: {flex: 1, marginLeft: 8},
    profilePic: {
      width: 38,
      height: 38,
      borderRadius: 38,
      alignSelf: 'center',
    },
  };
});

export default useStyles;
