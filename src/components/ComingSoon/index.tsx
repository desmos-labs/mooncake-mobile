import { Box, useTheme } from 'native-base';
import { verticalScale } from 'react-native-size-matters';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import React from 'react';

/**
 * The section that is "Coming Soon"
 */
interface Props {
  featureName: string;
}

/**
 * A placeholder component that display the message "Coming Soon"
 */
const ComingSoon = ({ featureName }: Props) => {
  const theme = useTheme();

  return (
    <Box flex={1} height={verticalScale(140)} py="m">
      <Typography.Subtitle2>{featureName}</Typography.Subtitle2>
      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        {/* ignored as this component is temporary */}
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Typography.Body7 style={{ color: theme.colors.midGrey, alignSelf: 'center' }}>
          Coming soon...
        </Typography.Body7>
      </Spacer>
    </Box>
  );
};

export default ComingSoon;
