import {errorImage} from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
  SectionList,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import NotificationComponent from 'screens/Activities/components/NotificationComponent';
import useHooks from './useHooks';
import useStyles from './useStyles';

/*
type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ACTIVITIES>;
*/

const Activities = () => {
  const {t} = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();
  const {notificationsData, globalLoading, notificationsRefetch} = useHooks();

  const EmptyActivities = useMemo(() => {
    return globalLoading ? (
      <ActivityIndicator size="large" />
    ) : (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={errorImage}
          style={{
            width: '100%',
            height: 163.55,
            resizeMode: 'cover',
          }}
        />
        <Typography.Body5>{t('no activities')}</Typography.Body5>
      </View>
    );
  }, [t, globalLoading]);

  const renderNotification = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      return (
        <NotificationComponent
          profile={item.profile}
          post={item.post}
          timestamp={item.timestamp}
          {...item.data}
        />
      );
    },
    [],
  );

  return (
    <DView
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      <Typography.H3>{t('activities')}</Typography.H3>
      <SectionList
        keyExtractor={(item, index) => item + index}
        refreshing={globalLoading}
        onRefresh={notificationsRefetch}
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyActivities}
        sections={notificationsData}
        renderItem={renderNotification}
        renderSectionHeader={({section: {section}}) => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.white,
              paddingTop: theme.spacing.m,
              paddingBottom: theme.spacing.s,
            }}>
            <Typography.Button2>{section}</Typography.Button2>
          </View>
        )}
      />
    </DView>
  );
};

export default Activities;
