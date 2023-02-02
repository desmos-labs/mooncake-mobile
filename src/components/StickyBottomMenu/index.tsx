import { commentIcon, commentLikeEmptyIcon, tipIcon } from 'assets/images';
import MenuButton from 'components/StickyBottomMenu/components/MenuButton';
import React from 'react';
import { View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import useStyles from './useStyles';

interface Props {
  /**
   * Action for the left button
   */
  leftButtonAction: () => void;
  leftButtonInteractions: number;
  /**
   * Action for the middle button
   */
  middleButtonAction: () => void;
  middleButtonInteractions: number;
  /**
   * Action for the right button
   */
  rightButtonAction: () => void;
  rightButtonInteractions: number;
}

// unused component
const StickyBottomMenu: React.FC<Props> = props => {
  const {
    leftButtonAction,
    middleButtonAction,
    rightButtonAction,
    leftButtonInteractions,
    middleButtonInteractions,
    rightButtonInteractions,
  } = props;
  const styles = useStyles();

  return (
    <Shadow viewStyle={styles.shadow} startColor="rgba(51, 51, 51, 0.15)" distance={20} radius={0}>
      <View style={styles.container}>
        <MenuButton
          onPress={leftButtonAction}
          interactionCount={leftButtonInteractions}
          icon={commentIcon}
        />
        <MenuButton
          onPress={middleButtonAction}
          interactionCount={middleButtonInteractions}
          icon={commentLikeEmptyIcon}
        />
        <MenuButton
          onPress={rightButtonAction}
          interactionCount={rightButtonInteractions}
          icon={tipIcon}
        />
      </View>
    </Shadow>
  );
};

export default StickyBottomMenu;
