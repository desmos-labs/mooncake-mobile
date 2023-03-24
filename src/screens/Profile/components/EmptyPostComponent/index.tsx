import { emptyListPlaceholder } from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from 'native-base';
import { makeStyle } from 'config/theme';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import ROUTES from 'navigation/routes';

export interface EmptyPostComponentProps {
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
        mx={100}
        justifyContent="center">
        {buttonLabel}
      </Button>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  emptyImage: {
    height: 72,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
  text: { textAlign: 'center' },
  button: {
    marginHorizontal: 150,
    justifyContent: 'center',
  },
}));

export default EmptyPostComponent;
