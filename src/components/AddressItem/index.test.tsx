import React from 'react';
import {render} from 'jest/utils/CustomRender';
import AddressItem from 'components/AddressItem/index';
import {useLazyQuery} from '@apollo/client';
import i18next from 'i18next';

jest.mock('@apollo/client', () => ({
  __esModule: true,
  // useQuery: (query: any) => {
  //   // other mocks if needed
  // },
  gql: jest.fn(),
  useLazyQuery: jest.fn().mockImplementation(() => [jest.fn(), {data: {}}]),
}));

describe('component: AddressItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const t = render(
      <AddressItem index={0} address="123" handlePress={jest.fn()} />,
    ).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('retrieves balance is address is desmos', () => {
    const mockGetBalance = jest.fn();

    (useLazyQuery as jest.Mock).mockImplementation(() => [
      mockGetBalance,
      {
        data: {
          action_account_balance: {
            coins: [
              {
                denom: 'DSM',
                amount: '1000',
              },
            ],
          },
        },
        loading: false,
      },
    ]);

    render(<AddressItem index={0} address="desmos" handlePress={jest.fn()} />);

    expect(mockGetBalance).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator if query is loading', () => {
    (useLazyQuery as jest.Mock).mockImplementation(() => [
      jest.fn(),
      {
        data: {
          action_account_balance: {
            coins: [
              {
                denom: 'DSM',
                amount: '1000',
              },
            ],
          },
        },
        loading: true,
      },
    ]);

    const t = render(
      <AddressItem index={0} address="desmos" handlePress={jest.fn()} />,
    ).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('shows already linked text if the address has already been linked', () => {
    const {getByText} = render(
      <AddressItem
        index={0}
        address="a"
        handlePress={jest.fn()}
        isAlreadyLinked
      />,
    );

    expect(
      getByText(String(i18next.t('connectAddress:alreadyLinked'))),
    ).toBeTruthy();
  });
});
