import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  postImage: {
    borderRadius: 2,
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 52,
    height: 52,
    resizeMode: 'cover',
  },
}));

export default useStyles;
