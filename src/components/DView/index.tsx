import React, {ReactElement} from 'react';
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
import {
  Edge,
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
import LoadingOverlay from 'components/LoadingOverlay';
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
  background?: React.ComponentProps<typeof ImageBackground>['source'];

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
};
// TODO fix statusBarStyle accordingly with the theme
const DView: React.FC<Props> = props => {
  const {
    scrollable,
    topBar,
    background,
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
    ...rest
  } = props;
  const styles = useStyles(props);

  return (
    <>
      <TouchableWithoutFeedback
        touchSoundDisabled
        disabled={disableHideKeyboardTouchable}
        onPress={() => Keyboard.dismiss()}>
        <SafeAreaView
          edges={edges ?? ['bottom', 'left', 'right', 'top']}
          style={[styles.root, backgroundColor ? {backgroundColor} : {}]}
          {...rest}>
          <StatusBar backgroundColor="transparent" {...statusBarProps} />
          {background !== undefined && (
            <ImageBackground style={styles.background} source={background} />
          )}
          {topBar}
          <View style={[styles.content, style]}>
            {scrollable ? (
              <ScrollView
                refreshControl={
                  enableRefreshControl ? (
                    <RefreshControl
                      enabled={enableRefreshControl || false}
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
                <View onStartShouldSetResponder={() => true} style={{flex: 1}}>
                  {children}
                </View>
              </ScrollView>
            ) : (
              children
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <LoadingOverlay isVisible={showLoadingOverlay} />
    </>
  );
};

export default DView;
