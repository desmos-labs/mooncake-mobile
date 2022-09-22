import {StackActions, useNavigation} from '@react-navigation/native';
import {mnemonicState, selectedChainState} from '@recoil/connectChainState';
import {defaultProfilePic} from 'assets/images';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {ActivityIndicator, Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {ChainAccount} from 'types/chains';
import {useQuery} from '@apollo/client';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import profilesState, {useLoadProfiles} from '@recoil/profiles';
import {isEqual} from 'lodash';
import LinkableChains from 'config/LinkableChains';
import AddProfileBadgeGroup from '../AddProfileBadgeGroup';
import useStyles from './useStyles';

type ContentProps = {
  mnemonic?: string;
  accounts: ChainAccount[];
};

const Content: FC<ContentProps> = ({mnemonic, accounts}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const theme = useTheme();
  const {dispatch} = useNavigation();

  const addresses = useMemo(() => accounts.map(acc => acc.address), [accounts]);
  const {loading, error, data, variables} = useQuery<{profile: ProfileData[]}>(
    GetProfileForAddresses,
    {variables: {addresses}},
  );
  if (error) throw error;

  const profiles = data?.profile ?? [];
  const {profiles: loadedProfiles, loading: loadingProfiles} =
    useLoadProfiles();
  const setLoadedProfiles = useSetRecoilState(profilesState);
  const [selectedAddresses, setSelectedAddresses] = useState(new Set<string>());
  const values = useMemo(() => {
    return profiles.map(({address, nickname, dtag, profile_pic}) => ({
      id: address,
      nickname,
      dTag: `@${dtag}`,
      profilePicture: profile_pic ? {uri: profile_pic} : defaultProfilePic,
      isSelected: selectedAddresses.has(address),
      disabled: loadedProfiles.some(p => p.address === address),
    }));
  }, [profiles, loadedProfiles, selectedAddresses]);

  const handleSelect = useCallback(
    (id: string) => {
      const disabled = loadedProfiles.some(p => p.address === id);
      const selected = selectedAddresses.has(id);

      if (!disabled && !selected) {
        setSelectedAddresses(prev => {
          if (prev.has(id)) return prev;
          const newSet = new Set(prev);
          newSet.add(id);
          return newSet;
        });
      } else {
        setSelectedAddresses(prev => {
          if (!prev.has(id)) return prev;
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    },
    [loadedProfiles, selectedAddresses],
  );

  const setMnemonic = useSetRecoilState(mnemonicState);
  const setSelectedChain = useSetRecoilState(selectedChainState);
  const handleCreateDesmosProfile = useCallback(() => {
    setMnemonic(mnemonic ?? '');
    setSelectedChain(LinkableChains.find(c => /^Desmos$/i.test(c.name))!);
    dispatch(StackActions.push(ROUTES.CONNECT_ADDRESS_GENERAL));
  }, [mnemonic]);

  const handleConfirmPressed = useCallback(async () => {
    setLoadedProfiles(prev => {
      if (!profiles.length) return prev;
      const newProfiles = prev.slice();
      profiles.forEach(profile => {
        if (prev.some(p => p.address === profile.address)) return;
        newProfiles.push(profile);
      });
      return newProfiles;
    });
  }, [selectedAddresses, profiles]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        {loading ||
        loadingProfiles ||
        !isEqual(variables?.addresses, addresses) ? (
          <ActivityIndicator />
        ) : (
          <AddProfileBadgeGroup values={values} onSelect={handleSelect} />
        )}
      </ScrollView>
      {profiles.length > loadedProfiles.length ? (
        <>
          <Button
            mode="text"
            color={theme.colors.surfaceBlack}
            style={styles.button}
            onPress={handleCreateDesmosProfile}>
            <Typography.Subtitle3 style={styles.textButton}>
              {t('addProfile:orCreateADesmosProfile')}
            </Typography.Subtitle3>
          </Button>
          <Button
            mode="contained"
            color={theme.colors.surfaceBlack}
            style={styles.button}
            disabled={selectedAddresses.size === 0}
            onPress={handleConfirmPressed}>
            <Typography.Button2 style={styles.buttonLabel}>
              {t('common:confirm')}
            </Typography.Button2>
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          style={styles.button}
          onPress={handleCreateDesmosProfile}>
          <Typography.Subtitle2 style={styles.buttonLabel}>
            {t('noDtagFound:createDesmosProfile')}
          </Typography.Subtitle2>
        </Button>
      )}
    </View>
  );
};

export default Content;
