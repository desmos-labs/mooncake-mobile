import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Button, { ButtonMode } from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useTheme } from 'native-base';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPACT_POINTS_MODAL>;

const ImpactPointsModal = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('invites');
  const { goBack } = useNavigation<NavProps['navigation']>();

  return (
    <BottomUpModalWrapper goBack={goBack}>
      <Typography.H4 style={styles.headerText}>{t('title modal')}</Typography.H4>
      <Spacer paddingVertical={16} />
      <Typography.Body5>{t('body modal')}</Typography.Body5>
      <Spacer paddingTop={20} paddingBottom={20}>
        <Typography.Body5>{t('caption modal')}</Typography.Body5>
      </Spacer>
      <View style={styles.tableContainer}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
          }}>
          <View style={[styles.tableLeft, { borderTopLeftRadius: 8 }]}>
            <Typography.Subtitle3>{t('action')}</Typography.Subtitle3>
          </View>
          <View style={[styles.tableRight, { borderTopRightRadius: 8 }]}>
            <Typography.Subtitle3>{t('points modal')}</Typography.Subtitle3>
          </View>
        </View>
        <View style={styles.flexRow}>
          <View style={styles.tableLeft}>
            <Typography.Body6>{t('create a post')}</Typography.Body6>
          </View>
          <View style={styles.tableRight}>
            <Typography.Body6>{t('2')}</Typography.Body6>
          </View>
        </View>
        <View style={styles.flexRow}>
          <View style={styles.tableLeft}>
            <Typography.Body6>{t('tip a post')}</Typography.Body6>
          </View>
          <View style={styles.tableRight}>
            <Typography.Body6>{t('3')}</Typography.Body6>
          </View>
        </View>
        <View style={styles.flexRow}>
          <View style={[styles.tableLeft, { borderBottomLeftRadius: 8 }]}>
            <Typography.Body6>{t('react a post')}</Typography.Body6>
          </View>
          <View style={[styles.tableRight, { borderBottomRightRadius: 8 }]}>
            <Typography.Body6>{t('1.5')}</Typography.Body6>
          </View>
        </View>
      </View>
      <Spacer paddingVertical={theme.spacing.xl}>
        <Button
          mode={ButtonMode.CONTAINED}
          size={44}
          backgroundColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          onPress={goBack}>
          {t('got it')}
        </Button>
      </Spacer>
    </BottomUpModalWrapper>
  );
};

export default ImpactPointsModal;
