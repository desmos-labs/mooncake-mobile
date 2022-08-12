import {commentIcon, optionsIcon, tipIcon} from 'assets/images';
import React from 'react';
import {View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import InteractionButton from 'screens/Home/components/InteractionButton';
import useStyles from './useStyles';

interface Props {
  /**
   * Action for the left button
   */
  leftButtonAction: () => void;
  /**
   * Action for the middle button
   */
  middleButtonAction: () => void;
  /**
   * Action for the right button
   */
  rightButtonAction: () => void;
}

const StickyBottomMenu: React.FC<Props> = props => {
  const {leftButtonAction, middleButtonAction, rightButtonAction} = props;
  const styles = useStyles();

  return (
    <Shadow
      viewStyle={styles.shadow}
      startColor="rgba(51, 51, 51, 0.15)"
      distance={20}
      radius={0}>
      <View style={styles.container}>
        <InteractionButton
          mode="text"
          onPress={leftButtonAction}
          interactionCount={10500}
          icon={commentIcon}
        />
        <InteractionButton
          mode="text"
          onPress={middleButtonAction}
          interactionCount={10500}
          icon={optionsIcon}
        />
        <InteractionButton
          mode="text"
          onPress={rightButtonAction}
          interactionCount={10500}
          icon={tipIcon}
        />
      </View>
    </Shadow>
  );
};

export default StickyBottomMenu;
