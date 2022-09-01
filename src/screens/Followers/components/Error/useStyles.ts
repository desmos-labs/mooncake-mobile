import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
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
    flexBasis: '100%',
  },
  errorText: {
    fontSize: 13,
  },
}));

export default useStyles;
