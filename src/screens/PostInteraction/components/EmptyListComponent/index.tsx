import { emptyListPlaceholder } from 'assets/images';
import Button, { ButtonMode, ButtonSize } from 'components/Button';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';

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
        <Image source={emptyListPlaceholder} style={styles.imageStyle} />
        <Typography.Body5 style={styles.textStyle}>{label}</Typography.Body5>
      </View>
      {additionalButton && handleButton && (
        <Button
          size={ButtonSize.M}
          additionalStyle={[styles.additionalButton, additionalButtonStyle]}
          mode={ButtonMode.OUTLINED}
          onPress={() => handleButton()}>
          {buttonLabel}
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
  imageStyle: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginBottom: theme.spacing.s,
  },
  buttonStyle: {
    marginTop: theme.spacing.l,
  },
  additionalButton: {
    marginTop: theme.spacing.l,
    marginHorizontal: 100,
  },
}));

export default EmptyListComponent;
