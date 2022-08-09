import React from 'react';
import {Animated, View, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

const CustomTabBar = ({state, descriptors, navigation, position}: any) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_: any, i: number) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: any) => (i === index ? 1 : 0.4)),
        });

        const indicatorOpacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: any) => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}>
            <Animated.View style={{opacity, alignItems: 'center'}}>
              <Typography.Button2>{label}</Typography.Button2>
              <Animated.View
                style={[styles.indicatorStyle, {opacity: indicatorOpacity}]}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
