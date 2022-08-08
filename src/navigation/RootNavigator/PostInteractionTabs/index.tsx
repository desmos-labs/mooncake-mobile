import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Animated from 'react-native-reanimated';
import {GestureDetector} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import CustomTabBar from 'navigation/RootNavigator/PostInteractionTabs/components/CustomTabBar';
import Spacer from 'components/Spacer';
import useAnimations from './useAnimations';
import useStyles from './useStyles';

const DummyScreen = () => (
  <View style={{flex: 1}}>
    <Text>Hello world</Text>
  </View>
);

export type PostInteractionTabsParams = {
  [ROUTES.POST_TIPS]: undefined;

  [ROUTES.POST_COMMENTS]: undefined;

  [ROUTES.POST_REACTIONS]: undefined;
};

const Tab = createMaterialTopTabNavigator<PostInteractionTabsParams>();

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_INTERACTION
>;

const PostInteractionTabs = () => {
  const {goBack} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const {panGesture, animatedStyle} = useAnimations();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={goBack}
        style={StyleSheet.absoluteFillObject}
      />
      <Spacer paddingTop={60} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle, styles.animatedContainer]}>
          <View style={styles.bar} />
          <Tab.Navigator
            sceneContainerStyle={styles.sceneContainerStyle}
            tabBar={CustomTabBar}>
            <Tab.Screen
              name={ROUTES.POST_COMMENTS}
              options={{
                tabBarLabel: 'Comments 1k',
              }}
              component={DummyScreen}
            />
            <Tab.Screen
              name={ROUTES.POST_REACTIONS}
              options={{
                tabBarLabel: 'Reactions 1k',
              }}
              component={DummyScreen}
            />
            <Tab.Screen
              name={ROUTES.POST_TIPS}
              options={{
                tabBarLabel: 'Tips 1k',
              }}
              component={DummyScreen}
            />
          </Tab.Navigator>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default PostInteractionTabs;
