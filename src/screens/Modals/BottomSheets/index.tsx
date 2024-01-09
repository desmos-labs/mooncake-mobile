import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import CommonStyles from 'config/theme/CommonStyles';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

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

  const onOutsidePress = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={CommonStyles.flex[1]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BottomUpModalWrapper goBack={onOutsidePress}>
        <Component {...props} />
      </BottomUpModalWrapper>
    </KeyboardAvoidingView>
  );
};

export default BottomSheetScreen;
