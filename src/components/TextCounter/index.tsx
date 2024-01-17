import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { HStack, useTheme } from 'native-base';
import React from 'react';

type Props = {
  maxChar: number;

  textToCount: string;
};

/**
 * A component that counts the length of textToCount,
 * and shows an error style if it exceeds maxChar.
 */
const TextCounter = ({ maxChar, textToCount }: Props) => {
  const theme = useTheme();
  return (
    <HStack mt="xs" alignSelf="flex-end">
      <Typography.Regular12
        style={{
          color: textToCount.length > maxChar ? theme.colors.error : theme.colors.grey02,
        }}>{`${textToCount.length}/${maxChar}`}</Typography.Regular12>
    </HStack>
  );
};

export default TextCounter;
