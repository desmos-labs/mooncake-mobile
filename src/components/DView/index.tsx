import React, {ReactElement} from 'react';
import {
  ImageBackground,
  Keyboard,
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

  statusBarProps?: React.ComponentProps<typeof StatusBar>;
};
// TODO fix statusBarStyle accordingly with the theme
const DView: React.FC<Props> = props => {
  const {scrollable, topBar, background, children, style, statusBarProps} =
    props;
  const styles = useStyles(props);

  return (
    <TouchableWithoutFeedback
      touchSoundDisabled
      onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.root}>
        <StatusBar backgroundColor="transparent" {...statusBarProps} />
        {background !== undefined && (
          <ImageBackground style={styles.background} source={background} />
        )}
        {topBar}
        <View style={[styles.content, style]}>
          {scrollable ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollViewOuter}
              contentContainerStyle={styles.scrollViewInner}>
              {children}
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
