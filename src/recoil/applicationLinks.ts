import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { ApplicationLink } from 'types/desmos';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * Recoil atom that holds all the application links of all the profiles stored inside the application.
 */
const applicationLinksState = atom<Record<string, ApplicationLink[]>>({
  key: 'applicationLinksState',
  default: getMMKV(MMKVKEYS.APPLICATION_LINKS) || {},
  effects: [
    ({ onSet }) => {
      onSet(applicationLinks => {
        setMMKV(MMKVKEYS.APPLICATION_LINKS, applicationLinks);
      });
    },
  ],
});

/**
 * Hook that allows to easily get the currently stored application links.
 */
export const useStoredApplicationLinks = () => useRecoilValue(applicationLinksState);

const mergeApplicationLinks = (
  first: ApplicationLink[],
  second: ApplicationLink[],
): ApplicationLink[] => {
  const applicationLinksSet: Set<string> = new Set<string>();
  first.map(link => JSON.stringify(link)).forEach(value => applicationLinksSet.add(value));
  second.map(link => JSON.stringify(link)).forEach(value => applicationLinksSet.add(value));
  return Array.from(applicationLinksSet).map(value => JSON.parse(value) as ApplicationLink);
};

/**
 * Hook that allows storing a list of application links associated with the same user inside the applications links state.
 */
export const useStoreUserApplicationLinks = () => {
  const setApplicationsLinks = useSetRecoilState(applicationLinksState);
  return React.useCallback(
    (user: string, applicationLinks: ApplicationLink[]) => {
      setApplicationsLinks(currentApplicationLinks => {
        // Merge the new links with the existing ones
        const exitingApplicationLinks = currentApplicationLinks[user] ?? [];
        const mergedLinks = mergeApplicationLinks(exitingApplicationLinks, applicationLinks);

        const newApplicationLinks: Record<string, ApplicationLink[]> = {
          ...currentApplicationLinks,
        };
        newApplicationLinks[user] = mergedLinks;
        return newApplicationLinks;
      });
    },
    [setApplicationsLinks],
  );
};

/**
 * Hook that allows to easily delete the application links for the user having a given address.
 */
export const useDeleteApplicationLinks = () => {
  const setApplicationLinks = useSetRecoilState(applicationLinksState);
  return React.useCallback(
    (address: string) => {
      setApplicationLinks(storedLinks => {
        const newValue: Record<string, ApplicationLink[]> = {
          ...storedLinks,
        };
        delete newValue[address];
        return newValue;
      });
    },
    [setApplicationLinks],
  );
};
