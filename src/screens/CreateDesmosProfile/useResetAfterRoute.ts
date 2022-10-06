import {nanoid} from 'nanoid/non-secure';
import {StackNavigationState, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {useCallback} from 'react';

type NavigationRoute =
  StackNavigationState<RootNavigatorParamList>['routes'][number];
/**
 * It resets the navigation stack to a given route, and optionally adds new routes to the stack
 * @returns A function that takes in a routeName and newRoutes and resets the navigation stack to the
 * routeName and newRoutes.
 */
function useResetAfterRoute() {
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  return useCallback(
    (
      routeName: keyof RootNavigatorParamList,
      ...newRoutes: Omit<NavigationRoute, 'key'>[]
    ) => {
      const state = navigation.getState();
      const routes = state.routes.slice();
      const profilesRouteIndex = _.findLastIndex(
        routes,
        r => r.name === routeName,
      );
      if (profilesRouteIndex === -1) {
        routes.splice(-1);
      } else {
        routes.splice(profilesRouteIndex + 1);
      }
      routes.push(
        ...newRoutes.map(route => ({
          key: `${route.name}-${nanoid()}`,
          ...route,
        })),
      );
      navigation.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    },
    [navigation],
  );
}

export default useResetAfterRoute;
