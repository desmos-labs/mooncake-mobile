import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

/**
 * Hook that provides the root navigator.
 */
const useRootNavigator = () => {
  return useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
};

export default useRootNavigator;
