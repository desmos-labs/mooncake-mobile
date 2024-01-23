import LoadingOverlay from 'components/LoadingOverlay';
import CommonStyles from 'config/theme/CommonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactElement, useCallback, useMemo } from 'react';
import {
  ColorValue,
  ImageBackground,
  Keyboard,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Edge, SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import useStyles from './useStyles';

export type Props = SafeAreaViewProps & {
  /**
   * True if the content should be wrapped inside a ScrollView
   */
  scrollable?: boolean;
  /**
   * Shows an element as a top bar
   */
  topBar?: ReactElement;
  /**
   * Image that will be displayed as background
   */
  backgroundImage?: React.ComponentProps<typeof ImageBackground>['source'];

  /**
   * Override themed background color
   */
  backgroundColor?: ColorValue;

  enableRefreshControl?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: Edge[];
  statusBarProps?: React.ComponentProps<typeof StatusBar>;
  disableHideKeyboardTouchable?: boolean;
  showLoadingOverlay?: boolean;
  onBackgroundPress?: () => void;
  backgroundFillScreen?: boolean;
  onTouchStart?: () => void;
  gradientColors?: string[];
};
// TODO fix statusBarStyle accordingly with the theme
const DView: React.FC<Props> = props => {
  const {
    scrollable,
    topBar,
    backgroundImage,
    children,
    backgroundColor,
    style,
    statusBarProps,
    disableHideKeyboardTouchable,
    refreshing,
    onRefresh,
    enableRefreshControl,
    edges,
    showLoadingOverlay,
    onBackgroundPress,
    onTouchStart,
    gradientColors,
    ...rest
  } = props;
  const styles = useStyles(props);

  const handleBackgroundPress = useCallback(() => {
    Keyboard.dismiss();
    onBackgroundPress?.();
  }, [onBackgroundPress]);

  const content = useMemo(() => {
    return (
      <>
        <TouchableWithoutFeedback
          touchSoundDisabled
          disabled={disableHideKeyboardTouchable}
          onPress={handleBackgroundPress}>
          <SafeAreaView
            edges={edges ?? ['bottom', 'left', 'right', 'top']}
            style={[styles.root, backgroundColor ? { backgroundColor } : {}, style]}
            onTouchStart={onTouchStart}
            {...rest}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent={true}
              {...statusBarProps}
            />
            {backgroundImage !== undefined && (
              <ImageBackground style={styles.background} source={backgroundImage} />
            )}
            {topBar}
            {scrollable ? (
              <ScrollView
                refreshControl={
                  enableRefreshControl ? (
                    <RefreshControl
                      enabled
                      onRefresh={onRefresh}
                      refreshing={refreshing || false}
                    />
                  ) : undefined
                }
                showsVerticalScrollIndicator={false}
                style={styles.scrollViewOuter}
                contentContainerStyle={styles.scrollViewInner}>
                {/*
                 this View will save the world (ScrollView behavior back to work normally as intended on iOS)
                 */}
                <View onStartShouldSetResponder={() => true} style={CommonStyles.flex[1]}>
                  {children}
                </View>
              </ScrollView>
            ) : (
              children
            )}
          </SafeAreaView>
        </TouchableWithoutFeedback>
        <LoadingOverlay isVisible={showLoadingOverlay ?? false} />
      </>
    );
  }, [
    backgroundColor,
    backgroundImage,
    children,
    disableHideKeyboardTouchable,
    edges,
    enableRefreshControl,
    handleBackgroundPress,
    onRefresh,
    onTouchStart,
    refreshing,
    rest,
    scrollable,
    showLoadingOverlay,
    statusBarProps,
    style,
    styles,
    topBar,
  ]);

  return gradientColors ? (
    <LinearGradient style={CommonStyles.flex['1']} colors={gradientColors}>
      {content}
    </LinearGradient>
  ) : (
    content
  );
};

export default DView;
