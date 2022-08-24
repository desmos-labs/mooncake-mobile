import {useNavigation} from '@react-navigation/native';
import React, {ReactElement} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

// type ScreenProps = {
//   navigation: {
//     readonly goBack: () => void;
//     readonly canGoBack: () => boolean;
//   };
// };

export type Props = {
  /**
   * Props regarding of the stack screen to manage.
   */
  // stackProps: ScreenProps;
  /**
   * Element to display on the center of the bar.
   */
  centerElement?: ReactElement;
  /**
   * Element to display on the top right corner.
   */
  rightElement?: ReactElement;
  style?: StyleProp<ViewStyle>;
};

/**
 * TODO: use react-navigation's header prop on navigator instead
 */
export const TopBar: React.FC<Props> = props => {
  const {
    // stackProps,
    centerElement,
    rightElement,
    style,
  } = props;
  const theme = useTheme();
  const styles = useStyles();

  const navigation = useNavigation<any>();
  // const {navigation} = stackProps;

  const navigationGoBack = navigation.canGoBack() ? (
    <TouchableOpacity
      hitSlop={{top: 30, bottom: 30, right: 30, left: 30}}
      onPress={navigation.goBack}>
      <Icon
        name="angle-left"
        color={theme.colors.black}
        size={24}
        allowFontScaling
      />
    </TouchableOpacity>
  ) : null;

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.container, styles.containerLeft]}>
        {navigationGoBack}
      </View>
      <View style={[styles.container, styles.containerCenter]}>
        {centerElement}
      </View>
      <View style={[styles.container, styles.containerRight]}>
        {rightElement}
      </View>
    </View>
  );
};

export default TopBar;
