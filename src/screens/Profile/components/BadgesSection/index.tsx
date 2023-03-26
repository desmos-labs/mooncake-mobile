import React from 'react';
import { useTranslation } from 'react-i18next';
import ComingSoon from 'components/ComingSoon';

/**
 * A component that displays the user's badges.
 * @constructor
 */
const BadgesSection = () => {
  const { t } = useTranslation('profile');

  return <ComingSoon featureName={t('badges')} />;
};

export default BadgesSection;
