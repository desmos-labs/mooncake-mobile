import {StackScreenProps} from '@react-navigation/stack';
import {modalSuccess} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {ReactNode} from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.FULLSCREEN_STATUS_SCREEN
>;

export type FullscreenStatusScreenParams = {
  image?: ImageSourcePropType;

  title: ReactNode | string;

  subtitle: ReactNode | string;

  buttonLabel: ReactNode | string;

  handleButtonPress: () => void;

  secondaryButtonLabel?: ReactNode | string;

  handleSecondaryButtonPress?: () => void;
};

const FullscreenStatusScreen = () => {
  const styles = useStyles();
  const theme = useTheme();

  const {
    params: {
      image,
      title,
      subtitle,
      buttonLabel,
      handleButtonPress,
      secondaryButtonLabel,
      handleSecondaryButtonPress,
    },
  } = useRoute<NavProps['route']>();

  return (
    <DView style={styles.root}>
      <Image source={image || modalSuccess} style={styles.image} />
      <View style={styles.textContainer}>
        <Typography.H4>{title}</Typography.H4>
        <Typography.Body6
          style={{marginTop: theme.spacing.s, textAlign: 'center'}}>
          {subtitle}
        </Typography.Body6>
      </View>
      <Button
        containerStyle={{marginTop: theme.spacing.l}}
        mode="gradientFilled"
        onPress={handleButtonPress}>
        {buttonLabel}
      </Button>
      {!!secondaryButtonLabel && (
        <Button
          containerStyle={{marginTop: theme.spacing.l}}
          mode="contained"
          onPress={handleSecondaryButtonPress}>
          {secondaryButtonLabel}
        </Button>
      )}
    </DView>
  );
};

export default FullscreenStatusScreen;
