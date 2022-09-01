import React, {ComponentProps, FC} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import {TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';
import SVGComponent from './background';

type Props = ComponentProps<typeof Button>;

const FollowButton: FC<Props> = props => {
  const {style, labelStyle, children, onPress, ...rest} = props;
  const styles = useStyles();
  const {t} = useTranslation('followingAndFollowers');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      {...rest}>
      <SVGComponent
        style={styles.svg}
        width={styles.button.width}
        height={styles.button.height}
      />
      <Typography.Button3 style={[styles.label, labelStyle]}>
        {children || t('follow')}
      </Typography.Button3>
    </TouchableOpacity>
  );
};

export default FollowButton;
