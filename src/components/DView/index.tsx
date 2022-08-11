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
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';
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

  statusBarProps?: React.ComponentProps<typeof StatusBar>;
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
    refreshing,
    onRefresh,
    enableRefreshControl,
  } = props;
  const styles = useStyles(props);

  return (
    <TouchableWithoutFeedback
      touchSoundDisabled
      onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={[styles.root, backgroundColor ? {backgroundColor} : {}]}>
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
  );
};

export default DView;
