import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Spacer from 'components/Spacer';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import CustomTabBar from 'navigation/RootNavigator/PostInteractionTabs/components/CustomTabBar';
import ROUTES from 'navigation/routes';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import PostReactions from 'screens/PostInteraction/PostReactions';
import PostTips from 'screens/PostInteraction/PostTips';
import useAnimations from './useAnimations';
import useStyles from './useStyles';

export type PostInteractionTabsParamList = {
  [ROUTES.POST_REACTIONS]: PostInteractionReactionsTabsParams;
  [ROUTES.POST_TIPS]: PostInteractionTipsTabsParams;
};

const Tab = createMaterialTopTabNavigator<PostInteractionTabsParamList>();

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_INTERACTION
>;

export type PostInteractionReactionsTabsParams = {
  /**
   * Fully expand the post interaction tab window on open
   */
  expandOnOpen: boolean;

  /**
   * Should the user be able to drag the tab window in and out?
   */
  allowPanning: boolean;
  postId: number;
  subspaceId: number;
};

export type PostInteractionTipsTabsParams = {
  /**
   * Fully expand the post interaction tab window on open
   */
  expandOnOpen: boolean;

  /**
   * Should the user be able to drag the tab window in and out?
   */
  allowPanning: boolean;
  postId: number;
  subspaceId: number;
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
            name={ROUTES.POST_REACTIONS}
            options={{
              tabBarLabel: 'Reactions',
            }}
            component={PostReactions}
          />
          <Tab.Screen
            name={ROUTES.POST_TIPS}
            options={{
              tabBarLabel: 'Tips',
            }}
            component={PostTips}
          />
        </Tab.Navigator>
      </Animated.View>
    </View>
  );
};

export default PostInteractionTabs;
