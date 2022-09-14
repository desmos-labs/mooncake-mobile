import React from 'react';
import {LayoutChangeEvent} from 'react-native';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';

const useAnimations = () => {
  const maxContainerHeight = React.useRef(0);
  const [expanded, setExpanded] = React.useState(false);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: {height},
      },
    } = event;

    maxContainerHeight.current = height;
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: 'transparent',
      // withTiming causes the container height to behave strangely,
      // so the adjustment on its height while expanded is necessary
      height: withTiming(expanded ? maxContainerHeight.current * 0.9 : 34),
    };
  });

  return {
    onLayout,
    animatedContainerStyle,
    expanded,
    setExpanded,
  };
};

export default useAnimations;
