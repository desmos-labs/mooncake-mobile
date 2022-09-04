import React, {FC, useEffect} from 'react';
import {Image, ListRenderItemInfo, View} from 'react-native';
import {QueueData} from 'services/graphql/queries/GetPaginatedFollowing';
import FollowButton from 'components/FollowButton';
import useFollowUser from 'hooks/useFollowUser';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type ListItemProps = ListRenderItemInfo<
  QueueData['paginatedFollowers'][number]
> & {
  subspaceID: number;
  handleError: (error: string) => void;
};

const ListItem: FC<ListItemProps> = ({item, subspaceID, handleError}) => {
  const styles = useStyles();

  /* Getting the following state and then it is getting the addresses of the following. */
  const {
    _: {profile_pic, nickname, dtag, address},
  } = item;
  const counterParty = {address, dtag, nickname};
  const {following, loading, error, follow, unfollow} = useFollowUser(
    subspaceID,
    counterParty,
  );
  useEffect(() => {
    if (error) handleError(error);
  }, [error]);
  return (
    <View style={styles.contentContainer}>
      {profile_pic ? (
        <Image
          source={{uri: profile_pic, width: 40, height: 40}}
          borderRadius={40}
          style={styles.pic}
        />
      ) : (
        <View style={styles.emptyPic} />
      )}
      <View style={styles.names}>
        <Typography.Caption3 numberOfLines={1} ellipsizeMode="tail">
          {nickname}
        </Typography.Caption3>
        <Typography.Caption2 numberOfLines={1} ellipsizeMode="tail">
          @{dtag}
        </Typography.Caption2>
      </View>
      {following ? (
        <FollowButton loading={loading} onPress={follow} type="follow" />
      ) : (
        <FollowButton loading={loading} onPress={unfollow} type="unfollow" />
      )}
    </View>
  );
};

export default ListItem;
