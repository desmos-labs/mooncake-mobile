import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 12,
      }}>
      <Typography.Regular12
        style={{
          color:
            textToCount.length > maxChar ? theme.colors.error : theme.colors.neutralVariants['600'],
        }}>{`${textToCount.length}/${maxChar}`}</Typography.Regular12>
    </View>
  );
};

export default TextCounter;
