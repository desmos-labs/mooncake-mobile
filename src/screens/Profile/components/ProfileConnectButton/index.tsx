import React from 'react';
import DButton from 'components/DButton';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  label: string;

  handlePress: () => void;
};

// should be used in a container with flexDirection:row, otherwise it will
// behave strangely
const ProfileConnectButton = ({label, handlePress}: Props) => {
  const styles = useStyles();

  return (
    <DButton
      mode="outlined"
      style={styles.connectButton}
      contentStyle={styles.connectButtonContent}
      onPress={handlePress}>
      <Typography.Button2 style={styles.connectButtonText}>
        {label}
      </Typography.Button2>
    </DButton>
  );
};

export default ProfileConnectButton;
