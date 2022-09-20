import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: theme.spacing.l,
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
  cameraButton: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
}));

export default useStyles;
