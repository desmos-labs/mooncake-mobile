import {renderHook, waitFor} from '@testing-library/react-native';
import useCheckIsAddressLinked from 'hooks/useCheckIsAddressLinked/index';
import {RecoilRoot} from 'recoil';
import React from 'react';
import {ChainLink} from 'types/link';

const mockActiveAddr = 'active-addr';

jest.mock('hooks/useActiveAccount', () => () => ({
  activeAddress: mockActiveAddr,
}));

const mockChainLinks: Partial<ChainLink>[] = [
  {
    externalAddress: '123',
  },
  {
    externalAddress: '234',
  },
  {
    externalAddress: 'abc',
  },
];

jest.mock('services/graphql/client', () => ({
  query: () => {
    return {
      data: {
        chain_link: mockChainLinks,
      },
    };
  },
}));

describe('hook: useCheckIsAddressLinked', () => {
  it('checks if address is already linked', async () => {
    const {result} = renderHook(() => useCheckIsAddressLinked(), {
      wrapper: props => <RecoilRoot>{props.children}</RecoilRoot>,
    });

    await waitFor(() => {
      expect(result.current.checkIsAddressLinked(mockActiveAddr)).toBeTruthy();
    });
  });
});
