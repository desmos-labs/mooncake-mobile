import {commentIcon, optionsIcon, tipIcon} from 'assets/images';
import React from 'react';
import {View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import InteractionButton from 'screens/Home/components/InteractionButton';
import useStyles from './useStyles';

interface Props {
  leftButtonAction: () => void;
  middleButtonAction: () => void;
  rightButtonAction: () => void;
}

const StickyBottomMenu: React.FC<Props> = props => {
  const {leftButtonAction, middleButtonAction, rightButtonAction} = props;
  const styles = useStyles();

  return (
    <View style={[styles.container, {position: 'absolute'}]}>
      <Shadow
        viewStyle={styles.shadow}
        containerViewStyle={{zIndex: 100}}
        startColor="rgba(51, 51, 51, 0.15)"
        distance={20}
        radius={0}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingBottom: 40,
            justifyContent: 'space-around',
          }}>
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
    </View>
  );
};

export default StickyBottomMenu;
