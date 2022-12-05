import {emptyInvitesImage} from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ListRenderItemInfo, SectionList, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import InviteComponent, {
  Invite,
} from 'screens/ManageInvites/components/InviteComponent';

interface Props {
  navigate: (args: any) => void;
}

const InvitesList = ({navigate}: Props) => {
  /*
  const [invitesLoading, setInvitesLoading] = useState(false);
*/
  /*
  const styles = useStyles();
*/
  const theme = useTheme();
  const {t} = useTranslation('invites');

  const pendingInvites = [
    {
      id: 1,
      address: '123454353453',
      creationDate: new Date().getDate(),
    },
  ];

  const successfulInvites = [
    {
      id: 2,
      address: '12345435345364564',
      creationDate: new Date().getDate(),
    },
    {
      id: 3,
      address: '12345435345364545',
      creationDate: new Date().getDate(),
    },
  ];

  const mock = [
    {section: t('pending invites'), data: pendingInvites},
    {section: t('successful invites'), data: successfulInvites},
  ];

  const renderInvite = React.useCallback(
    ({item}: ListRenderItemInfo<Invite>) => {
      return <InviteComponent {...item} />;
    },
    [],
  );

  const EmptyInvites = useMemo(() => {
    return mock.length === 0 ? null : (
      <View
        style={{
          justifyContent: 'center',
          marginHorizontal: theme.spacing.m,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={emptyInvitesImage}
            style={{
              width: 96,
              height: 70,
              resizeMode: 'cover',
              marginBottom: theme.spacing.l,
            }}
          />
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
  }, [t]);

  return (
    <SectionList
      keyExtractor={(item, index) => item.code.toString() + index}
      /*      refreshing={invitesLoading}
      onRefresh={notificationsRefetch} */
      style={{flex: 1}}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={EmptyInvites}
      sections={[]}
      renderItem={renderInvite}
      renderSectionHeader={({section: {section}}) => (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.backgroundGrey,
            paddingTop: theme.spacing.m,
            paddingBottom: theme.spacing.s,
          }}>
          <Typography.Button2>{section}</Typography.Button2>
        </View>
      )}
    />
  );
};

export default InvitesList;
