import React from 'react';
import {LayoutChangeEvent} from 'react-native';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';

const useAnimations = () => {
  const maxContainerHeight = React.useRef(0);
  const [expanded, setExpanded] = React.useState(false);
  const theme = useTheme();

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
      backgroundColor: theme.colors.background,
      // withTiming causes the container height to behave strangely,
      // so the adjustment on its height while expanded is necessary
      height: withTiming(expanded ? maxContainerHeight.current * 0.9 : 38),
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
