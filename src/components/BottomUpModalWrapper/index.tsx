import { makeStyle } from 'config/theme';
import React, { useState } from 'react';
import { Keyboard, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { HStack, useTheme } from 'native-base';
import Animated from 'react-native-reanimated';
import useModalAnimations from 'screens/Modals/utils/useModalAnimations';

type Props = TouchableOpacityProps & {
  /**
   * goBack navigation function
   */
  goBack: () => void;
  /**
   * optional padding
   */
  paddingHorizontal?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
};

/**
 * Bottom-up modal wrapper, with animations and navigations
 * The default close threshold is half of the modal height
 * Feel free to update any prop you need
 */
const BottomUpModalWrapper: React.FC<Props> = props => {
  const { goBack, paddingHorizontal, paddingTop, paddingBottom, children } = props;
  const styles = useStyles();
  const theme = useTheme();
  const [threshold, setThreshold] = useState(0);
  const { panGesture, animatedStyle, tabAnimatedStyleLeft, tabAnimatedStyleRight } =
    useModalAnimations(threshold);

  return (
    <GestureDetector gesture={panGesture}>
      <TouchableOpacity activeOpacity={1} onPress={goBack} style={styles.container}>
        {/* animated view to manage the dragY animation */}
        <Animated.View
          style={animatedStyle}
          onLayout={event => {
            setThreshold(event.nativeEvent.layout.height / 2);
          }}>
          {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
          {/* parts of the modal content are pressed */}
          <TouchableOpacity
            onPress={Keyboard.dismiss}
            activeOpacity={1}
            style={[
              styles.innerContainer,
              {
                paddingHorizontal: paddingHorizontal || theme.spacing.l,
                paddingTop: paddingTop || 10,
                paddingBottom: paddingBottom || theme.spacing.l,
              },
            ]}>
            <HStack justifyContent="center">
              <Animated.View style={[styles.tabIconLeft, tabAnimatedStyleLeft]} />
              <Animated.View style={[styles.tabIconRight, tabAnimatedStyleRight]} />
            </HStack>
            {children}
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </GestureDetector>
  );
};

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tabIconLeft: {
    marginTop: 2,
    position: 'absolute',
    width: 16,
    height: 4,
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2,
  },
  tabIconRight: {
    marginTop: 2,
    position: 'absolute',
    width: 16,
    height: 4,
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2,
  },
  headerText: {
    textAlign: 'left',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.s,
    alignSelf: 'center',
  },
  innerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
}));

export default BottomUpModalWrapper;
