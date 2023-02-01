import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import MnemonicWordBadge from 'components/MnemonicWordBadge';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type CheckMnemonicParams = {
  mnemonic: string;
};

export type Props = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CHECK_MNEMONIC
>;
const CheckMnemonic = (props: Props): JSX.Element => {
  const {
    route: {
      params: {mnemonic},
    },
    navigation,
  } = props;
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('checkMnemonic');
  const receivedMnemonic = mnemonic;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const words = useMemo(
    () => _.shuffle(receivedMnemonic.split(' ')),
    [receivedMnemonic],
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...words]);

  const onWordSelected = useCallback(
    (word: string) => {
      const removeIndex = availableWords.indexOf(word);
      if (removeIndex >= 0) {
        availableWords.splice(removeIndex, 1);
        setAvailableWords(availableWords);
        setSelectedWords([...selectedWords, word]);
      }
    },
    [availableWords, selectedWords],
  );

  const onWordDeselected = useCallback(
    (word: string) => {
      const removeIndex = selectedWords.indexOf(word);
      setErrorMessage(null);
      if (removeIndex >= 0) {
        selectedWords.splice(removeIndex, 1);
        setSelectedWords(selectedWords);
        setAvailableWords([...availableWords, word]);
      }
    },
    [availableWords, selectedWords],
  );

  const onWordClearAll = useCallback(() => {
    setErrorMessage(null);
    setAvailableWords([...availableWords, ...selectedWords]);
    setSelectedWords([]);
  }, [selectedWords, availableWords]);

  const onCheckPressed = useCallback(() => {
    if (selectedWords.length !== words.length) {
      setErrorMessage(t('invalid recovery passphrase, please try again'));
    } else {
      const composedMnemonic = selectedWords.join(' ');
      if (receivedMnemonic === composedMnemonic) {
        console.log('ready to navigate');
      } else {
        setErrorMessage(t('invalid order, please try again'));
      }
    }
  }, [navigation, receivedMnemonic, selectedWords, t, words.length]);

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <Typography.H3>Backup Secret Recovery Phrase</Typography.H3>
      <Typography.Body6 style={{marginTop: theme.spacing.m}}>
        {t('tap to order')}
      </Typography.Body6>

      <View
        style={[
          styles.selectedWordsContainer,
          errorMessage ? {borderColor: theme.colors.pink01} : null,
        ]}>
        {selectedWords.map((w, i) => (
          <MnemonicWordBadge
            style={[
              styles.wordBadgeSelected,
              errorMessage ? {backgroundColor: theme.colors.pink03} : null,
            ]}
            /* eslint-disable-next-line react/no-array-index-key */
            key={`${w}-${i}`}
            value={w}
            onPress={onWordDeselected}
          />
        ))}
      </View>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Typography.Caption1 style={styles.errorParagraph}>
            {errorMessage}
          </Typography.Caption1>
          <Button
            mode="text"
            size={26}
            textColor={theme.colors.butterOrange01}
            onPress={() => onWordClearAll()}>
            {t('clear all')}
          </Button>
        </View>
      ) : null}

      <View style={styles.availableWordsContainer}>
        {availableWords.map((w, i) => (
          <MnemonicWordBadge
            style={styles.wordBadge}
            key={`${w}-${i * 2}`}
            value={w}
            onPress={onWordSelected}
          />
        ))}
      </View>
      <Button
        mode="contained"
        size={44}
        textColor={theme.colors.white}
        backgroundColor={theme.colors.surfaceBlack}
        onPress={onCheckPressed}>
        {t('confirm')}
      </Button>
      {/*      {__DEV__ && (
        <Button
          onPress={() => {
            setAvailableWords([]);
            setSelectedWords(mnemonic.split(' '));
          }}
          mode="contained">
          (DBG) Auto sort
        </Button>
      )} */}
    </DView>
  );
};

export default CheckMnemonic;
