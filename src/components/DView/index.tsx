import React, {ReactElement} from 'react';
import {ImageBackground, ScrollView, StatusBar, View} from 'react-native';
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
};
// TODO fix statusBarStyle accordingly with the theme
const DView: React.FC<Props> = props => {
  const {scrollable, topBar, background, children, style} = props;
  const styles = useStyles(props);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="transparent" />
      {background !== undefined && (
        <ImageBackground style={styles.background} source={background} />
      )}
      {topBar}
      <View style={[styles.content, style]}>
        {scrollable ? <ScrollView>{children}</ScrollView> : children}
      </View>
    </SafeAreaView>
  );
};

export default DView;
