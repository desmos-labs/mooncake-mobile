import { useNavigation } from '@react-navigation/native';
import BackButton from 'components/BackButton';
import React, { ReactElement, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import useStyles from './useStyles';

export type Props = {
  /**
   * Element to display on the center of the bar.
   */
  centerElement?: ReactElement;
  /**
   * Element to display on the top right corner.
   */
  rightElement?: ReactElement;
  style?: StyleProp<ViewStyle>;
  /**
   * Custom behavior for the back button
   */
  backButtonCustomBehavior?: () => void;
  /**
   * Remove back button
   */
  noBackButton?: boolean;
};

/**
 * TODO: use react-navigation's header prop on navigator instead
 */
export const TopBar: React.FC<Props> = props => {
  const { centerElement, rightElement, style, backButtonCustomBehavior, noBackButton } = props;
  const styles = useStyles();

  const navigation = useNavigation<any>();

  const navigationGoBack = useMemo(() => {
    if (backButtonCustomBehavior) {
      return <BackButton onPress={backButtonCustomBehavior} />;
    }
    return navigation.canGoBack() && !noBackButton ? (
      <BackButton onPress={navigation.goBack} />
    ) : null;
  }, [backButtonCustomBehavior, navigation, noBackButton]);

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.container, styles.containerLeft]}>{navigationGoBack}</View>
      <View style={[styles.container, styles.containerCenter]}>{centerElement}</View>
      <View style={[styles.container, styles.containerRight]}>{rightElement}</View>
    </View>
  );
};

export default TopBar;
