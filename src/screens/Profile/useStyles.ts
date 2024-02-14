import { makeStyleWithProps } from 'config/theme';
import { Dimensions, Platform } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';

export const PROFILE_HEADER_HEIGHT = (Dimensions.get('window').width * 9) / 20;
export const PROFILE_HEADER_HEIGHT_COMPACT =
  Platform.OS === 'ios' ? verticalScale(80) : verticalScale(46);
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
      paddingHorizontal: theme.spacings.m,
      zIndex: 5,
    },
    topBarNameView: {
      flex: 1,
      width: '100%',
      paddingVertical: theme.spacings.s,
      position: 'absolute',
      marginTop: Platform.OS === 'ios' ? props.insets.top : props.insets.top + 8,
      flexDirection: 'row',
      paddingHorizontal: theme.spacings.m,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    contentView: {
      flex: 1,
      marginTop: theme.spacings.s,
      paddingHorizontal: theme.spacings.m,
      backgroundColor: theme.colors.background,
      paddingBottom: Platform.OS == 'ios' ? verticalScale(80) : verticalScale(116),
    },
    contentContainerStyle: { flexGrow: 1 },
    contentContainer: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      paddingTop: theme.spacings.s,
    },
    topViewButton: { justifyContent: 'center', alignItems: 'center' },
    innerContainer: {
      flex: 1,
      marginTop: 32,
    },
    innerTopSection: {
      flexDirection: 'column',
      justifyContent: 'space-between',
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
      justifyContent: 'space-between',
    },
    topButton: {
      width: 32,
      height: 32,
    },
    topButtonRight: {
      position: 'absolute',
      right: 0,
    },
    profileConnectionsButtonContainer: {
      flexDirection: 'row',
      gap: theme.spacings.l,
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
      marginHorizontal: -theme.spacings.m,
      height: 8,
      backgroundColor: theme.colors.neutralVariants['200'],
    },
    flexCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    connectionButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacings.xs,
    },
    nickname: {
      marginTop: 6,
    },
    profileDtag: {
      marginVertical: 4,
      color: theme.colors.neutralVariants['700'],
    },
    postCount: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    r20: {
      right: 20,
    },
    linkText: {
      color: theme.colors.primary,
    },
    followUnfollowSection: {
      flexDirection: 'row',
      marginTop: theme.spacings.s,
    },
    tipUserIcon: {
      width: 24,
      height: 24,
      marginBottom: 4,
      marginRight: 5,
    },
    btStyle: {
      backgroundColor: theme.colors.neutralVariants['300'],
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipStyle: {
      paddingHorizontal: theme.spacings.l,
      gap: 4,
    },
    walletButton: {
      alignSelf: 'flex-end',
      marginTop: 8,
    },
  }),
);

export default useStyles;
