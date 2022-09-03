import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  contentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    maxHeight: 60,
    minHeight: 60,
  },
  pic: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 40,
    margin: 5,
  },
  emptyPic: {
    backgroundColor: '#D9D9D9',
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
  },
  subtitle: {},
  names: {
    marginHorizontal: 10,
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'stretch',
  },
}));

export default useStyles;
