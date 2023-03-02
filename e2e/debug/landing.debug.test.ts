import {by, device, element, expect} from 'detox';
import launchAppConfig from '../config';

describe('Debug to Landing Test', () => {
  beforeEach(async () => {
    await device.launchApp(launchAppConfig);
  });

  it('should tap on continue to landing button and expect some text and three buttons to be visible', async () => {
    await element(by.text('Continue to Landing screen')).tap();
    await expect(element(by.text('Butter'))).toBeVisible();
    await expect(
      element(by.text('Your decentralized social network')),
    ).toBeVisible();
  });
});
