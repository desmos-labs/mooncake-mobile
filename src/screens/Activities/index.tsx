import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

// type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ACTIVITIES>;

const Activities = () => {
  const {t} = useTranslation('activities');
  // const {navigate} = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const styles = useStyles();

  /*  const EmptyActivities = useMemo(() => {
    return (
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
  }, []); */

  return (
    <DView
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      <Typography.H3>{t('activities')}</Typography.H3>
      {/*      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        data={[]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyActivities}
      /> */}
    </DView>
  );
};

export default Activities;
