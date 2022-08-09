import React from 'react';
import {Image, View} from 'react-native';
import {errorImage} from 'assets/images';
import {makeStyle} from 'config/theme';
import Typography from 'components/Typography';
import Button from 'components/Button';

type Props = {
  label: string;

  buttonLabel?: string;

  handleButtonPress?: () => void;
};

const EmptyListComponent = ({handleButtonPress, label, buttonLabel}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={errorImage} style={styles.imageStyle} />
        <Typography.Body5 style={styles.textStyle}>{label}</Typography.Body5>
      </View>

      {handleButtonPress && buttonLabel && (
        <Button
          containerStyle={styles.buttonStyle}
          mode="gradientFilled"
          onPress={handleButtonPress}>
          {buttonLabel}
        </Button>
      )}
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  container: {
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
    width: 230,
    height: 116,
    resizeMode: 'contain',
  },
  buttonStyle: {
    marginTop: theme.spacing.l,
  },
}));

export default EmptyListComponent;
