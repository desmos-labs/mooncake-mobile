import DView from 'components/DView';
import TopBar from 'components/TopBar';
import React from 'react';
import Typography from 'components/Typography';
import { communitiesBackgroundImage } from 'assets/images';
import useStyles from './useStyles';

const Communities = () => {
  const styles = useStyles();

  return (
    <DView
      style={styles.container}
      topBar={<TopBar />}
      backgroundImage={communitiesBackgroundImage}
      backgroundFillScreen={true}>
      <Typography.H5>Decentralised Communities</Typography.H5>
      <Typography.H5 style={styles.bottomText}>Coming soon</Typography.H5>
    </DView>
  );
};

export default Communities;
