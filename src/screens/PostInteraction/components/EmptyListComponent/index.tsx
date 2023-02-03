import {errorImage} from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
import Typography from 'components/Typography';
import {makeStyle} from 'config/theme';
import React from 'react';
import {Image, StyleProp, View, ViewStyle} from 'react-native';

type Props = {
  label: string;
  additionalButton?: boolean;
  buttonLabel?: string;
  handleButton?: () => void;
  additionalButtonStyle?: StyleProp<ViewStyle>;
};

const EmptyListComponent = ({
  label,
  additionalButton,
  buttonLabel,
  handleButton,
  additionalButtonStyle,
}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={errorImage} style={styles.imageStyle} />
        <Typography.Body5 style={styles.textStyle}>{label}</Typography.Body5>
      </View>
      {additionalButton && (
        <Button
          size={ButtonSize.M}
          additionalStyle={[styles.additionalButton, additionalButtonStyle]}
          mode={ButtonMode.CONTAINED}
          onPress={handleButton}>
          <Typography.Button3 style={styles.buttonText}>
            {buttonLabel}
          </Typography.Button3>
        </Button>
      )}
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  container: {
    paddingVertical: theme.spacing.m,
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    textAlign: 'center',
  },
  imageStyle: {
    width: 335,
    height: 116,
    resizeMode: 'contain',
  },
  buttonStyle: {
    marginTop: theme.spacing.l,
  },
  additionalButton: {
    marginTop: theme.spacing.xl,
    marginHorizontal: 80,
  },
}));

export default EmptyListComponent;
