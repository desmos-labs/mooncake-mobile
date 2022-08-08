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
import PostComments from 'screens/PostInteraction/PostComments';
import useAnimations from './useAnimations';
import useStyles from './useStyles';

const DummyScreen = () => (
  <View style={{flex: 1}}>
    <Text>Hello world</Text>
  </View>
);

export type PostInteractionTabsParamList = {
  [ROUTES.POST_TIPS]: PostInteractionTabsParams;

  [ROUTES.POST_COMMENTS]: PostInteractionTabsParams;

  [ROUTES.POST_REACTIONS]: PostInteractionTabsParams;
};

const Tab = createMaterialTopTabNavigator<PostInteractionTabsParamList>();

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_INTERACTION
>;

export type PostInteractionTabsParams = {
  /**
   * Fully expand the post interaction tab window on open
   */
  expandOnOpen: boolean;

  /**
   * Should the user be able to drag the tab window in and out?
   */
  allowPanning: boolean;
};

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
      <Animated.View style={[animatedStyle, styles.animatedContainer]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.barContainer}>
            <View style={styles.bar} />
          </View>
        </GestureDetector>

        <Tab.Navigator
          sceneContainerStyle={styles.sceneContainerStyle}
          tabBar={CustomTabBar}>
          <Tab.Screen
            name={ROUTES.POST_COMMENTS}
            options={{
              tabBarLabel: 'Comments 1k',
            }}
            component={PostComments}
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
    </View>
  );
};

export default PostInteractionTabs;
