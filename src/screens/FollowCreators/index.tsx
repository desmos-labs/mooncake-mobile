import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import useStyles from './useStyles';

export interface FollowCreatorsParams {}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.FOLLOW_CREATORS>;

/**
 * Screen that will allow the user to follow their first 3 creators.
 * This screen will be shown during the onboarding process.
 */
const FollowCreators: React.FC<NavProps> = () => {
  const styles = useStyles();

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <Typography.H3>Follow Creators</Typography.H3>
    </DView>
  );
};

export default FollowCreators;
