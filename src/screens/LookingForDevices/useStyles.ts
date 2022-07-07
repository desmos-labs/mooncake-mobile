import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  // inactiveDotColor: surface1,
  headerStyle: {
    color: theme.colors.font[1],
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionStyle: {
    color: theme.colors.font[1],
    textAlign: 'center',
  },
  warningStyle: {
    color: theme.colors.font[4],
    textAlign: 'center',
    marginTop: 30,
  },
  graphicGroup: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btDeviceImg: {
    width: 45.3,
    height: 79.6,
    resizeMode: 'contain',
    marginRight: 8,
  },
  ledgerImg: {
    width: 13,
    height: 72.3,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 22,
  },
  flatlistContainer: {
    marginTop: 22,
  },
}));

export default useStyles;
