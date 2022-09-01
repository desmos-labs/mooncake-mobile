import {errorImage} from 'assets/images';
import Typography from 'components/Typography';
import {makeStyle} from 'config/theme';
import React from 'react';
import {Image, View} from 'react-native';

type Props = {
  label: string;
};

const EmptyListComponent = ({label}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={errorImage} style={styles.imageStyle} />
        <Typography.Body5 style={styles.textStyle}>{label}</Typography.Body5>
      </View>
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
    width: 230,
    height: 116,
    resizeMode: 'contain',
  },
  buttonStyle: {
    marginTop: theme.spacing.l,
  },
}));

export default EmptyListComponent;
