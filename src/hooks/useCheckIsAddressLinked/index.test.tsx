import {renderHook} from '@testing-library/react-native';
import useCheckIsAddressLinked from 'hooks/useCheckIsAddressLinked/index';
import {RecoilRoot} from 'recoil';
import React from 'react';
import chainLinkState from '@recoil/chainLinks';
import {ChainLink} from 'types/link';

const mockActiveAddr = 'active-addr';

jest.mock('hooks/useActiveAccount', () => () => ({
  activeAddress: mockActiveAddr,
}));

describe('hook: useCheckIsAddressLinked', () => {
  it('checks if address is already linked', () => {
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

    const initializeState = ({set}: any) => {
      // simulate a case where the user is not following the addrToFollow
      set(chainLinkState, mockChainLinks);
    };

    const {result} = renderHook(() => useCheckIsAddressLinked(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    expect(
      result.current.checkIsAddressLinked(mockChainLinks[0].externalAddress!),
    ).toBeTruthy();

    // should also detect active address as linked
    expect(result.current.checkIsAddressLinked(mockActiveAddr)).toBeTruthy();
  });
});
