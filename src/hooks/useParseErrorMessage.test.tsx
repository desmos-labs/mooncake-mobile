import React from 'react';
import useParseErrorMessage from 'hooks/useParseErrorMessage';
import { RecoilRoot } from 'recoil';
import { NativeBaseProvider, Text } from 'native-base';
import { render } from '@testing-library/react-native';
import lightTheme from 'config/theme/LightTheme';

const getErrorMessage = (error: string) => {
  // This component is needed to test the hook.
  const TestComponent: React.FC = () => {
    const parseErrorMessage = useParseErrorMessage();
    const parsedError = parseErrorMessage(error);
    return <Text testID="error">{parsedError}</Text>;
  };

  // Render the test component
  const { getByTestId } = render(
    <RecoilRoot>
      <NativeBaseProvider theme={lightTheme}>
        <TestComponent />
      </NativeBaseProvider>
    </RecoilRoot>,
  );

  // Get the parsed error
  const parsedError = getByTestId('error');
  return parsedError.props.children;
};

describe('useParseErrorMessage', () => {
  it('insufficient balance error', () => {
    const result = getErrorMessage('spendable balance is smaller than 123udsm: insufficient funds');
    expect(result).toEqual(
      "Sorry, you don't have enough tokens to do this. You need at least 0.000123 DSM. Ask someone to send you some, or get them on Osmosis",
    );
  });

  it('insufficient funds error', () => {
    const result = getErrorMessage('insufficient funds: 123udsm');
    expect(result).toEqual(
      "Sorry, you don't have enough tokens to do this. You need at least 0.000123 DSM. Ask someone to send you some, or get them on Osmosis",
    );
  });
});
