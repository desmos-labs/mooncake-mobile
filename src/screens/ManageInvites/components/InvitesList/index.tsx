import {emptyInvitesImage} from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  SectionList,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import InviteComponent, {
  Invite,
} from 'screens/ManageInvites/components/InviteComponent';
import useHooks from '../../useHooks';
import useStyles from './useStyles';

interface Props {
  navigate: (args: any) => void;
}

const InvitesList = ({navigate}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {invitesSectioned, data, loading, refetch, t} = useHooks();

  const renderInvite = React.useCallback(
    ({item}: ListRenderItemInfo<Invite>) => {
      console.log(item);
      return <InviteComponent {...item} />;
    },
    [],
  );

  const EmptyInvites = useMemo(() => {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Image source={emptyInvitesImage} style={styles.emptyImage} />
          <Typography.Body5>{t('no invites yet')}</Typography.Body5>
        </View>

        <Spacer paddingVertical={theme.spacing.l} />
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={() => navigate(ROUTES.INVITES)}>
          {t('invite friends now')}
        </Button>
      </View>
    );
  }, [data]);

  const bottomComponent = useMemo(() => {
    return data?.invite?.length === 3 ? (
      <Typography.Body6
        style={{
          color: theme.colors.grey01,
          alignSelf: 'center',
          textAlign: 'center',
        }}>
        {t('sent all')}
      </Typography.Body6>
    ) : (
      <Button
        onPress={() => navigate(ROUTES.INVITES)}
        mode="contained"
        color={theme.colors.surfaceBlack}
        style={{marginHorizontal: theme.spacing.m}}>
        {t('invite more')}
      </Button>
    );
  }, [data]);

  return (
    <View style={{flex: 1}}>
      {!data?.invite && loading ? (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator />
        </SafeAreaView>
      ) : (
        <>
          <SectionList
            keyExtractor={(item, index) => item.code.toString() + index}
            refreshing={loading}
            onRefresh={refetch}
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: theme.spacing.m,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyInvites}
            sections={invitesSectioned}
            renderItem={renderInvite}
            renderSectionHeader={({section: {section}}) => (
              <View style={styles.header}>
                <Typography.Button2>{section}</Typography.Button2>
              </View>
            )}
          />
          {data?.invite?.length !== 0 && bottomComponent}
        </>
      )}
    </View>
  );
};

export default InvitesList;
