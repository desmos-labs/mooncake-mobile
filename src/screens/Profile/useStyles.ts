import { makeStyleWithProps } from 'config/theme';
import { Dimensions, Platform } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';

export const PROFILE_HEADER_HEIGHT = (Dimensions.get('window').width * 9) / 20;
export const PROFILE_HEADER_HEIGHT_COMPACT = verticalScale(80);
export const PROFILE_HEADER_HEIGHT_EXPANDED = PROFILE_HEADER_HEIGHT - PROFILE_HEADER_HEIGHT_COMPACT;

const useStyles = makeStyleWithProps(
  (
    props: {
      insets: EdgeInsets;
      isActiveAccount: boolean;
    },
    theme,
  ) => ({
    root: {
      flex: 1,
      paddingBottom: props.isActiveAccount ? 0 : props.insets.bottom,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      zIndex: 3,
      marginTop: PROFILE_HEADER_HEIGHT_COMPACT,
      paddingTop: PROFILE_HEADER_HEIGHT_EXPANDED,
      flexGrow: 1,
    },
    topBarView: {
      flex: 1,
      position: 'absolute',
      marginTop: Platform.OS === 'ios' ? props.insets.top : props.insets.top + 8,
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.m,
      zIndex: 5,
    },
    contentView: {
      flex: 1,
      marginTop: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      backgroundColor: theme.colors.background,
      paddingBottom: PROFILE_HEADER_HEIGHT_COMPACT + verticalScale(10),
    },
    contentContainerStyle: { flexGrow: 1 },
    contentContainer: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      paddingTop: theme.spacing.s,
    },
    topViewButton: { justifyContent: 'center', alignItems: 'center' },
    innerContainer: {
      flex: 1,
      marginTop: props.isActiveAccount ? 36 : 32,
    },
    innerTopSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    organizedEventsIcon: {
      width: 20,
      height: 20,
    },
    organizedEventsText: {
      color: theme.colors.primary,
    },
    topButtonsContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    topButton: {
      width: 32,
      height: 32,
    },
    topButtonRight: {
      position: 'absolute',
      right: 0,
    },
    rightButtonsContainer: {
      flexDirection: 'row',
      marginTop: props.isActiveAccount ? -120 : -100,
    },
    rightButton: {
      width: 32,
      height: 32,
    },
    icon: {
      width: 24,
      height: 24,
    },
    coverPicturePressable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 4,
    },
    flexRow: {
      flexDirection: 'row',
    },
    flexStart: { alignSelf: 'flex-start' },
    buttonStyleLeft: {
      zIndex: 3,
      position: 'absolute',
      top: props.insets.top + 6,
      left: 20,
      height: 32,
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonStyleRight: {
      zIndex: 3,
      position: 'absolute',
      top: props.insets.top + 6,
      height: 32,
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contextButtonPosition: {
      zIndex: 5,
      position: 'absolute',
      top: props.insets.top + 6,
      right: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contextButtonStyle: {
      height: 32,
      width: 32,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
    },
    profileTopBarContainer: {
      flex: 1,
    },
    topBarImage: { height: 32, width: 32 },
    divider: {
      marginHorizontal: -theme.spacing.m,
      height: 8,
      backgroundColor: theme.colors.surfaceGrey,
    },
    flexCenter: { flex: 1, justifyContent: 'center' },
    arrowView: {
      zIndex: 2,
      position: 'absolute',
      top: props.insets.top + 13,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    animatedDtag: {
      zIndex: 2,
      position: 'absolute',
      top: props.insets.top + 7,
      left: 0,
      right: 0,
    },
    dtag: {
      color: theme.colors.white,
      alignSelf: 'center',
      maxWidth: '25%',
    },
    centerLeftSpacingM: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.m,
    },
    nickname: {
      marginTop: 10,
    },
    profileDtag: {
      marginVertical: 4,
      color: theme.colors.darkGrey,
    },
    postCount: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    r20: {
      right: 20,
    },
    linkText: {
      color: theme.colors.accentBlue01,
    },
    followUnfollowSection: {
      flexDirection: 'row',
      marginTop: theme.spacing.s,
    },
    tipUserIcon: {
      width: 24,
      height: 24,
      marginBottom: 4,
      marginRight: 5,
    },
    btStyle: {
      backgroundColor: '#E8E8E8',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipStyle: {
      paddingHorizontal: theme.spacing.l,
      gap: 4,
    },
  }),
);

export default useStyles;
