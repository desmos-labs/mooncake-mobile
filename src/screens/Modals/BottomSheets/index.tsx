import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeStyleWithProps } from 'config/theme';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomSheetScreenProps<P> {
  /**
   * Component that will be rendered in the bottom sheet.
   */
  readonly component: React.FC<P>;
  /**
   * Props that will be passed to the component.
   */
  readonly props?: P;
}

type BottomSheetNavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.BOTTOM_SHEET>;

/**
 * Screen that displays a generic bottom sheet.
 */
const BottomSheetScreen: React.FC<BottomSheetNavProps> = ({ navigation, route }) => {
  const { component: Component, props } = route.params;
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useStyles(safeAreaInsets);

  const onOutsidePress = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={onOutsidePress}>
        <View style={styles.outisideContent} />
      </TouchableWithoutFeedback>
      <View style={styles.content}>
        <Component {...props} />
      </View>
    </View>
  );
};

export default BottomSheetScreen;

const useStyles = makeStyleWithProps((props: EdgeInsets, theme) => ({
  root: {
    flex: 1,
  },
  outisideContent: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    bottom: props.bottom,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
}));
