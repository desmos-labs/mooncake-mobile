import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated from 'react-native-reanimated';
import {GestureDetector} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useAnimations from './useAnimations';
import useStyles from './useStyles';

const Tab = createMaterialTopTabNavigator();

const DummyScreen = () => (
  <View style={{flex: 1}}>
    <Text>Hello world</Text>
  </View>
);

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
      <GestureDetector gesture={panGesture}>
        <View style={{height: Dimensions.get('window').height * 0.8}}>
          <Animated.View style={[animatedStyle, styles.animatedContainer]}>
            <View style={styles.bar} />
            <Tab.Navigator>
              <Tab.Screen name="one" component={DummyScreen} />
              <Tab.Screen name="two" component={DummyScreen} />
              <Tab.Screen name="three" component={DummyScreen} />
            </Tab.Navigator>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default PostInteractionTabs;
