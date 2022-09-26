import React, {ComponentProps, FC} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = ComponentProps<typeof Button> & {
  type: 'follow' | 'unfollow';
};

const FollowButton: FC<Props> = props => {
  const {
    style,
    labelStyle,
    children,
    type = 'follow',
    onPress,
    ...rest
  } = props;
  const styles = useStyles();
  const {t} = useTranslation('followingAndFollowers');
  const [styleOfButton, styleOfLabel, label] =
    type !== 'follow'
      ? [styles.follow, styles.followLabel, t('follow')]
      : [styles.unfollow, styles.unfollowLabel, t('unfollow')];
  return (
    <Button
      onPress={onPress}
      style={[styleOfButton, style]}
      {...rest}
      labelStyle={[styleOfLabel, labelStyle]}
      mode="outlined">
      <Typography.Button3 style={[styleOfLabel, labelStyle]}>
        {children || label}
      </Typography.Button3>
    </Button>
  );
};

export default FollowButton;
