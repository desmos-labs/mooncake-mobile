import React from 'react';
import {Animated, ColorValue, StyleSheet, View} from 'react-native';

type Props = {
  /**
   * Number of dots to render
   */
  numDots?: number;

  /**
   * The time for an animation to complete.
   */
  animationDelay?: number;

  /**
   * The color of the inactive dots.
   */
  inactiveColor?: ColorValue;

  /**
   * The color of the active dots.
   */
  activeColor?: ColorValue;

  /**
   * Whether to show the fading dots.
   */
  hideActiveDots?: boolean;

  /**
   * Control how large the indicators should be.
   */
  dotSize?: number;
};

/**
 * A customizable and controllable loading indicator with a fading dot animation
 * fading in sequentially from left to right.
 */
const LoadingIndicator = ({
  numDots = 5,
  animationDelay = 500,
  inactiveColor = 'gray',
  activeColor = 'red',
  hideActiveDots,
  dotSize = 10,
}: Props) => {
  // Math.random to (hopefully) generate a unique number per dot.
  // The values are used as the key when mapping. This is very bad but
  // I am too lazy to prepare a proper keyExtractor function
  const iterableArray = React.useRef(new Array(numDots).fill(0)).current;

  const opacity = React.useRef(
    iterableArray.map(_ => new Animated.Value(0)),
  ).current;

  const dotsAnimation = React.useRef(
    Animated.loop(
      Animated.sequence(
        iterableArray.map((_, idx) =>
          Animated.parallel([
            Animated.timing(opacity[idx], {
              toValue: 1,
              duration: animationDelay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity[idx === 0 ? numDots - 1 : idx - 1], {
              toValue: 0,
              duration: animationDelay,
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    ),
  ).current;

  React.useEffect(() => {
    if (hideActiveDots) {
      dotsAnimation.stop();
      opacity.forEach(x => x.setValue(0));
    } else {
      dotsAnimation.reset();
      dotsAnimation.start();
    }
  }, [hideActiveDots]);

  return (
    <View style={styles.container}>
      <View style={[styles.container, StyleSheet.absoluteFillObject]}>
        {iterableArray.map((_, idx) => (
          <View
            /* eslint-disable-next-line react/no-array-index-key */
            key={`${idx}-dot`}
            style={[
              styles.ellipsis,
              {
                height: dotSize,
                width: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: inactiveColor,
              },
            ]}
          />
        ))}
      </View>
      {iterableArray.map((_, idx) => (
        <Animated.View
          /* eslint-disable-next-line react/no-array-index-key */
          key={`${idx}-dot2`}
          style={[
            styles.ellipsis,
            {opacity: opacity[idx]},
            {
              height: dotSize,
              width: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: activeColor,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ellipsis: {
    backgroundColor: 'blue',
    marginHorizontal: 4,
  },
});

export default LoadingIndicator;
