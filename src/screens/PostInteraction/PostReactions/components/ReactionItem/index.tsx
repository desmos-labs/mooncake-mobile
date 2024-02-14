import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import AvatarImage from 'components/AvatarImage';
import ToggleFollowageButton from 'components/ToggleFollowageButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

type Props = {
  author: DesmosProfile;
};

/**
 * Component that is used in order to display the given {@param reaction} inside a list.
 * @constructor
 */
const ReactionItem = ({ author }: Props) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <AvatarImage imageSource={author} size={48} />
      <View style={styles.textGroup}>
        <View>
          <Typography.Semibold14 style={styles.textStyle}>
            {author.nickname ? author.nickname : t('no nickname', { ns: 'common' })}
          </Typography.Semibold14>
          <Typography.Regular12 style={styles.subTextStyle}>@{author.dTag}</Typography.Regular12>
        </View>
      </View>
      <ToggleFollowageButton user={author} />
    </View>
  );
};

export default ReactionItem;
