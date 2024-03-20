import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import { emptyPostsIcon } from 'assets/images';
import Spacer from 'components/Spacer';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import useStyles from './useStyles';

interface EmptyPostComponentProps {
  readonly textLabel: string;
}

/**
 * A component that displays an empty post.
 * @constructor
 */
const EmptyPostComponent = (props: EmptyPostComponentProps) => {
  const theme = useTheme();
  const { textLabel } = props;
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Spacer paddingVertical={theme.spacings.m} />
      <Image style={styles.emptyImage} source={emptyPostsIcon} contentFit="contain" />
      <Typography.Regular14 style={styles.text}>{textLabel}</Typography.Regular14>
      <Spacer paddingVertical={theme.spacings.m} />
    </View>
  );
};

export default EmptyPostComponent;
