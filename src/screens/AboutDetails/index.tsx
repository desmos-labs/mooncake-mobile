import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import { makeStyle } from 'config/theme';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';

export interface AboutDetailsParams {
  readonly title: string;
  readonly message: string;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.ABOUT_DETAILS>;

const AboutDetails: React.FC<NavProps> = ({
  route: {
    params: { title, message },
  },
}) => {
  const styles = useStyles();

  return (
    <DView style={styles.root} disableHideKeyboardTouchable topBar={<TopBar />}>
      <Typography.Semibold24>{title}</Typography.Semibold24>
      <Spacer paddingTop="m" />
      <Typography.Regular16>{message}</Typography.Regular16>
    </DView>
  );
};

export default AboutDetails;

const useStyles = makeStyle(() => ({
  root: {
    paddingHorizontal: 20,
  },
}));
