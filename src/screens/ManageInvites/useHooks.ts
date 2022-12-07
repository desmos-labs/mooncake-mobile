import {useQuery} from '@apollo/client';
import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import GetInvites from 'services/graphql/queries/GetInvites';

const useHooks = () => {
  const {t} = useTranslation('invites');
  const [rewardBalance, setRewardBalance] = useState<number>();
  const {data, loading, refetch} = useQuery(GetInvites, {
    fetchPolicy: 'no-cache',
  });

  const invitesSectioned = useMemo(() => {
    if (!data?.invite) {
      return [];
    }

    const pending: any[] = [];
    const successful: any[] = [];

    data.invite.forEach((invite: any) => {
      if (invite.claimer) {
        successful.push({...invite, index: data.invite.indexOf(invite) + 1});
      } else {
        pending.push({...invite, index: data.invite.indexOf(invite) + 1});
      }
    });

    setRewardBalance(successful.length * 2);

    if (pending.length > 0 && successful.length <= 0) {
      return [{section: t('pending invites'), data: pending}];
    } else if (pending.length <= 0 && successful.length > 0) {
      return [{section: t('successful invites'), data: successful}];
    } else if (pending.length > 0 && successful.length > 0) {
      return [
        {section: t('pending invites'), data: pending},
        {section: t('successful invites'), data: successful},
      ];
    } else {
      return [];
    }
  }, [data]);

  return {
    invitesSectioned,
    rewardBalance,
    data,
    loading,
    refetch,
    t,
  };
};

export default useHooks;
