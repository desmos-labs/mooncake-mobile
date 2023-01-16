import useSubscribeToPostsByActiveAddress from 'hooks/subscriptions/useSubscribeToPostsByActiveAddress';
import useSubscribeToUserFollowingChanges from 'hooks/subscriptions/useSubscribeToUserFollowingChanges';

const useSubscriptions = () => {
  useSubscribeToPostsByActiveAddress();
  useSubscribeToUserFollowingChanges();
};

export default useSubscriptions;
