import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  contentContainer: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pic: {
    flexGrow: 0,
    flexBasis: 50,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
    flexBasis: '100%',
  },
  subtitle: {},
  names: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

export default useStyles;
