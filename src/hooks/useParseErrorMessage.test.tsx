import { render } from '@testing-library/react-native';
import useParseErrorMessage from 'hooks/useParseErrorMessage';
import React from 'react';
import { Text } from 'react-native';
import { RecoilRoot } from 'recoil';

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
      <TestComponent />
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

  it('relationship already exists', () => {
    const result = getErrorMessage(
      "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: relationship from desmos1jqqaczvut9028dhcey3f7w33p07a2vhwzh4mfj to desmos1q3f03r2203c4wgw6369d5akwujrk6a4lx7r626 does not exist inside subspace 6: invalid request [desmos-labs/desmos/v6/x/relationships/keeper/msg_server.go:78] With gas wanted: '100000000' and gas used: '45340' : unknown request",
    );
    expect(result).toEqual('You are not following this user');
  });

  it('relationship does not exist', () => {
    const result = getErrorMessage(
      "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: relationship from desmos1jqqaczvut9028dhcey3f7w33p07a2vhwzh4mfj to desmos1q3f03r2203c4wgw6369d5akwujrk6a4lx7r626 already exists inside subspace 6: invalid request [desmos-labs/desmos/v6/x/relationships/keeper/msg_server.go:42] With gas wanted: '100000000' and gas used: '46340' : unknown request",
    );
    expect(result).toEqual('You are already following this user');
  });

  it('post length exceeded', () => {
    const result = getErrorMessage(
      "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: text exceeded max length allowed: invalid post [desmos-labs/desmos/v6/x/posts/keeper/posts.go:120] With gas wanted: '100000000' and gas used: '83636' : unknown request",
    );
    expect(result).toEqual('Your post is too long');
  });
});
