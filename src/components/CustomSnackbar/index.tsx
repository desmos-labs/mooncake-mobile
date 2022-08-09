import Button from 'components/Button';
import Typography from 'components/Typography';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useStyles from './useStyles';

interface Props {
  transactions: {label: string}[];
}

const CustomSnackbarGroup = ({transactions}: Props): JSX.Element => {
  const styles = useStyles();
  const positionY = useSharedValue(-120);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withSpring(positionY.value)}],
    };
  });

  useEffect(() => {
    return () => {
      positionY.value = 0;
    };
  }, []);

  return (
    <View style={{position: 'absolute', right: 0, left: 0, top: 10}}>
      {transactions.map(value => {
        return (
          <Animated.View
            style={[styles.commonToastStyle, animatedStyle]}
            key={value.label}>
            <Typography.Body6 style={{alignSelf: 'center'}}>
              {value.label}
            </Typography.Body6>
            <Button
              style={styles.button}
              mode="text"
              onPress={() => console.log('test')}>
              <Typography.Subtitle3>test</Typography.Subtitle3>
            </Button>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default CustomSnackbarGroup;
