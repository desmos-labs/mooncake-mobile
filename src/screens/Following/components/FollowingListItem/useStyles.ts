import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    height: 60,
  },
  pic: {
    margin: 5,
    borderRadius: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  names: {
    marginHorizontal: 10,
    flex: 1,
  },
  dTagStyle: {
    color: theme.colors.grey02,
  },
}));

export default useStyles;
