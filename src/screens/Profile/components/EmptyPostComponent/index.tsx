import { emptyListPlaceholder } from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from 'native-base';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import ROUTES from 'navigation/routes';
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
      <Spacer paddingVertical={theme.spacing.m} />
      <Image style={styles.emptyImage} source={emptyListPlaceholder} />
      <Typography.Body6 style={styles.text}>{textLabel}</Typography.Body6>
      <Spacer paddingVertical={theme.spacing.m} />
      <Button
        onPress={() => navigateToHome(ROUTES.HOME_TAB_DISCOVER)}
        size={44}
        variant="outlined"
        mx="100px"
        justifyContent="center">
        {buttonLabel}
      </Button>
    </View>
  );
};

export default EmptyPostComponent;
