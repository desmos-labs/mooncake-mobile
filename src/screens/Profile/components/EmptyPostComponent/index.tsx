import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { emptyListPlaceholder } from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import { useTheme } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React from 'react';
import { Image, View } from 'react-native';
import useStyles from './useStyles';

interface EmptyPostComponentProps {
  readonly textLabel: string;
  readonly buttonLabel: string;
}

/**
 * A component that displays an empty post.
 * @constructor
 */
const EmptyPostComponent = (props: EmptyPostComponentProps) => {
  const theme = useTheme();
  const { textLabel, buttonLabel } = props;
  const styles = useStyles();
  const navigateToHome = useNavigateToHome();
  return (
    <View style={styles.container}>
      <Spacer paddingVertical={theme.spacings.m} />
      <Image style={styles.emptyImage} source={emptyListPlaceholder} />
      <Typography.Regular14 style={styles.text}>{textLabel}</Typography.Regular14>
      <Spacer paddingVertical={theme.spacings.m} />
      <Button onPress={() => navigateToHome(ROUTES.HOME_TAB_DISCOVER)} height={44} type="outline">
        {buttonLabel}
      </Button>
    </View>
  );
};

export default EmptyPostComponent;
