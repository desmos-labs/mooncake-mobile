import React from 'react';
import { Box, Divider, VStack } from 'native-base';
import Typography from 'components/Typography';
import StyledSpinner from 'components/StyledSpinner';

interface Props {
  /**
   * A high-context description of the row of data.
   */
  title: string;

  /**
   * A low-context description of the row of data.
   */
  subtitle?: string;

  /**
   * If true, will display a loading spinner instead of subtitle. This is useful if the result of the row is asynchronous.
   */
  isLoading?: boolean;
}

/**
 * A component that represents a row of data on the broadcastTxOnChain screen.
 */
const TransactionRow = (props: Props) => {
  const { title, subtitle, isLoading } = props;

  return (
    <VStack alignItems="flex-start">
      <Box mb="m">
        <Typography.Body5>{title}</Typography.Body5>
      </Box>
      {isLoading ? <StyledSpinner /> : <Typography.Body5>{subtitle}</Typography.Body5>}

      <Divider my="m" />
    </VStack>
  );
};

export default TransactionRow;
