import React from 'react';
import Typography from 'components/Typography';
import { HStack, useTheme } from 'native-base';

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
      <Typography.Body7
        style={{
          color: textToCount.length > maxChar ? theme.colors.error : theme.colors.grey02,
        }}>{`${textToCount.length}/${maxChar}`}</Typography.Body7>
    </HStack>
  );
};

export default TextCounter;
