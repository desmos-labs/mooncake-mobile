import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  divider: {
    flexGrow: 1,
    margin: 10,
    height: 1,
    backgroundColor: 'rgb(239,239,239)',
  },
  loadingContainer: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
  errorContainer: {
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
  },
  errorMessage: {
    padding: 16,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  errorText: {
    fontSize: 13,
  },
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
