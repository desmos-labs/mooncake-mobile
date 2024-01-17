import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { emptyListPlaceholder } from 'assets/images';
import Button from 'components/Button';
import { makeStyle } from 'config/theme';
import React from 'react';
import { Image, View } from 'react-native';

type Props = {
  label: string;
  additionalButton?: boolean;
  buttonLabel?: string;
  handleButton?: () => void;
};

const EmptyListComponent = ({ label, additionalButton, buttonLabel, handleButton }: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <View style={styles.contentContainer}>
        <Image source={emptyListPlaceholder} style={styles.imageStyle} />
        <Typography.Regular14 style={styles.textStyle}>{label}</Typography.Regular14>
      </View>
      {additionalButton && handleButton && (
        <Button size={44} textColor="white" onPress={handleButton} mt="xl" mx="80px">
          {buttonLabel}
        </Button>
      )}
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
  },
  contentContainer: {
    alignItems: 'center',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
  imageStyle: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: theme.spacing.m,
  },
  buttonStyle: {
    marginTop: theme.spacing.l,
  },
  additionalButton: {
    marginHorizontal: 100,
    marginTop: theme.spacing.l,
  },
}));

export default EmptyListComponent;
