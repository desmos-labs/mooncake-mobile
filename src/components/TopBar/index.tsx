import React, {ReactElement} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

type ScreenProps = {
  navigation: {
    readonly goBack: () => void;
    readonly canGoBack: () => boolean;
  };
};

export type Props = {
  /**
   * Props regarding of the stack screen to manage.
   */
  stackProps: ScreenProps;
  /**
   * Element to display on the top right corner.
   */
  rightElement?: ReactElement;
  style?: StyleProp<ViewStyle>;
};

export const TopBar: React.FC<Props> = props => {
  const {stackProps, rightElement, style} = props;
  const theme = useTheme();
  const styles = useStyles();
  const {navigation} = stackProps;
  const navigationGoBack = navigation.canGoBack() ? (
    <Icon
      name="angle-left"
      color={theme.colors.icon[1]}
      size={24}
      allowFontScaling
    />
  ) : null;

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.container, styles.containerLeft]}>
        {navigationGoBack}
      </View>
      <View style={[styles.container, styles.containerRight]}>
        {rightElement}
      </View>
    </View>
  );
};

export default TopBar;
