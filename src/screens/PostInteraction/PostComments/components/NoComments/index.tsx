import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {errorImage} from 'assets/images';
import {makeStyle} from 'config/theme';
import Typography from 'components/Typography';
import Button from 'components/Button';

type Props = {
  handlePress: () => void;
};

const NoComments = ({handlePress}: Props) => {
  const {t} = useTranslation('postInteraction');

  const styles = useStyles();

  return (
    <View>
      <View style={styles.contentContainer}>
        <Image source={errorImage} style={styles.imageStyle} />
        <Typography.Body5 style={styles.textStyle}>
          {t('noComments')}
        </Typography.Body5>
      </View>

      <Button
        containerStyle={styles.buttonStyle}
        mode="gradientFilled"
        onPress={handlePress}>
        {t('comment')}
      </Button>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
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

export default NoComments;
