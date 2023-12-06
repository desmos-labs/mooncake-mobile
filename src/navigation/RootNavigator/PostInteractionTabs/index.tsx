import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import CustomTabBar from 'navigation/RootNavigator/PostInteractionTabs/components/CustomTabBar';
import ROUTES from 'navigation/routes';
import React from 'react';
import { View } from 'react-native';
import PostReactions from 'screens/PostInteraction/PostReactions';
import { Post } from 'types/posts';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import useStyles from './useStyles';

const Tab = createMaterialTopTabNavigator();

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_INTERACTION>;

export type PostInteractionTabsParamList = {
  [ROUTES.POST_TIPS]: PostInteractionTabParams;
  [ROUTES.POST_REACTIONS]: PostInteractionTabParams;
};

export type PostInteractionTabParams = {
  /**
   * The post to show the interactions for.
   */
  post: Post;
};

/**
 * Tabs that allow to show the list of various interactions a post had.
 * @constructor
 */
const PostInteractionTabs = () => {
  const { params } = useRoute<NavProps['route']>();
  const { goBack } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();

  return (
    <BottomUpModalWrapper goBack={goBack} paddingHorizontal={0.1}>
      <View style={styles.container}>
        <Tab.Navigator
          initialRouteName={ROUTES.POST_REACTIONS}
          sceneContainerStyle={styles.sceneContainerStyle}
          tabBar={CustomTabBar}>
          <Tab.Screen
            name={ROUTES.POST_REACTIONS}
            options={{
              tabBarLabel: 'Reactions',
            }}
            initialParams={params.params}
            component={PostReactions}
          />
        </Tab.Navigator>
      </View>
    </BottomUpModalWrapper>
  );
};

export default PostInteractionTabs;
