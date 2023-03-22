import React from 'react';
import { useTranslation } from 'react-i18next';
import ComingSoon from 'components/ComingSoon';

/**
 * A component that displays the user's NFTs.
 * @constructor
 */
const NFTsSection = () => {
  const { t } = useTranslation('profile');

  return <ComingSoon featureName={t('nfts')} />;
};

export default NFTsSection;
