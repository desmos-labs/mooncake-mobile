import { useQuery } from '@apollo/client';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GetInvites from 'services/graphql/queries/GetInvites';
import { useActiveAccountAddress } from '@recoil/accounts';

const useHooks = () => {
  const activeAddress = useActiveAccountAddress();
  const { t } = useTranslation('invites');
  const [rewardBalance, setRewardBalance] = useState<number>();
  const [filteredInvites, setFilteredInvites] = useState<any[]>();
  const { data, loading, refetch } = useQuery(GetInvites, {
    fetchPolicy: 'no-cache',
  });

  const invitesSectioned = useMemo(() => {
    if (!data?.invite) {
      return [];
    }

    const filteredInvitesWithoutSelfInvite = data.invite.filter(
      (invite: any) => invite?.claimer_address !== activeAddress,
    );

    setFilteredInvites(filteredInvitesWithoutSelfInvite);

    const hasBeenInvited = data.invite.find(
      (invite: any) => invite?.claimer_address === activeAddress,
    );

    if (hasBeenInvited) {
      setRewardBalance(prev => (prev ? prev + 2 : 2));
    }

    const [successful, pending] = _.partition(
      filteredInvitesWithoutSelfInvite.map((invite: any) => {
        return {
          ...invite,
          index: filteredInvitesWithoutSelfInvite.indexOf(invite) + 1,
        };
      }),
      (invite: any) => invite.claimer,
    );

    setRewardBalance(prev => (prev ? prev + successful.length * 2 : successful.length * 2));

    if (pending.length > 0 && successful.length <= 0) {
      return [{ section: t('pending invites'), data: pending }];
    } else if (pending.length <= 0 && successful.length > 0) {
      return [{ section: t('successful invites'), data: successful }];
    } else if (pending.length > 0 && successful.length > 0) {
      return [
        { section: t('pending invites'), data: pending },
        { section: t('successful invites'), data: successful },
      ];
    } else {
      return [];
    }
  }, [data.invite, activeAddress, t]);

  return {
    invitesSectioned,
    rewardBalance,
    data,
    loading,
    refetch,
    t,
    filteredInvites,
  };
};

export default useHooks;
