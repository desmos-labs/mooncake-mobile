import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import Typography from 'components/Typography';
import React from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

type Props = {
  state: TabNavigationState<ParamListBase>;
  position: Animated.AnimatedInterpolation<any>;
  navigation: any;
  disableButtons: boolean;
  getTabName: (routeName: string) => string | undefined;
  spaceBetween?: boolean;
};

const TabHeader = ({
  state,
  position,
  navigation,
  disableButtons,
  getTabName,
  spaceBetween,
}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {state.routes.map((route, idx) => {
        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === idx ? 1 : 0)),
        });

        const isFocused = state.index === idx;

        const onPress = () => {
          if (!disableButtons) {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabButton,
              spaceBetween ? { marginHorizontal: 72 } : { marginHorizontal: 8 },
            ]}>
            <Typography.Button2
              numberOfLines={1}
              style={[styles.buttonText, isFocused ? styles.selected : styles.unselected]}>
              {getTabName(route.name)}
            </Typography.Button2>
            {isFocused && <Animated.View style={[styles.selectedIndicator, { opacity }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabHeader;
