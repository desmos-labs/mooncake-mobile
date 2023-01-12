import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useRequestNotificationsPermission from 'hooks/useRequestNotificationsPermission';
import React from 'react';
import useStyles from './useStyles';

const Communities = () => {
  const styles = useStyles();

  useRequestNotificationsPermission();

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.Body6>Coming soon..</Typography.Body6>
    </DView>
  );
};

export default Communities;
