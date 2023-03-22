import { errorImage } from 'assets/images';
import Button from 'components/CustomButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { Image } from 'react-native';
import { Box, useTheme } from 'native-base';
import CommonStyles from 'config/theme/CommonStyles';
import useStyles from './useStyles';

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
  const styles = useStyles();
  const { textLabel, buttonLabel } = props;

  return (
    <Box flex={1}>
      <Spacer paddingVertical={theme.spacing.m} />
      <Image style={styles.errorImage} source={errorImage} />
      <Typography.Body6 style={CommonStyles.textAlign.center}>{textLabel}</Typography.Body6>
      <Spacer paddingVertical={theme.spacing.m} />
      <Button size={44} variant="outlined" mx={100} justifyContent="center">
        {buttonLabel}
      </Button>
    </Box>
  );
};

export default EmptyPostComponent;
