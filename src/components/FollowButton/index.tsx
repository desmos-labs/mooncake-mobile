import React, {ComponentProps, FC} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import Typography from 'components/Typography';
import useStyles from './useStyles';
import SvgFollow from './SvgFollow';
import SvgUnfollow from './SvgUnfollow';

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
  const [BackgroundComponent, styleOfButton, styleOfLabel, label] =
    type === 'follow'
      ? [SvgFollow, styles.follow, styles.followLabel, t('follow')]
      : [SvgUnfollow, styles.unfollow, styles.unfollowLabel, t('unfollow')];
  return (
    <Button
      onPress={onPress}
      style={[styleOfButton, style]}
      {...rest}
      mode="backgroundComponent"
      BackgroundComponent={BackgroundComponent}>
      <Typography.Button3 style={[styleOfLabel, labelStyle]}>
        {children || label}
      </Typography.Button3>
    </Button>
  );
};

export default FollowButton;
