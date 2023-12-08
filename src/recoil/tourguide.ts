import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { DefaultTourGuideState, TourGuideState } from 'types/tourguide';

const tourGuideAtom = atom<TourGuideState>({
  key: 'tourGuideAppState',
  default: (() => {
    const data = getMMKV<TourGuideState>(MMKVKEYS.TOUR_GUIDE);
    return {
      ...DefaultTourGuideState,
      ...data,
    };
  })(),
  effects: [
    ({ onSet }) => {
      onSet(newSettingsValues => {
        setMMKV(MMKVKEYS.TOUR_GUIDE, newSettingsValues);
      });
    },
  ],
});

/**
 * Hook that provides a function to update the tour guide states
 * that we store on the device storage.
 */
export const useSetCachedTourGuide = () => useSetRecoilState(tourGuideAtom);

/**
 * Hook that provides the current cached tour guide state.
 */
export const useCachedTourGuide = () => useRecoilValue(tourGuideAtom);

/**
 * Hook that provides a function to reset the tour guide state.
 */
export const useResetTourGuideState = () => {
  const setTourGuide = useSetCachedTourGuide();
  return React.useCallback(() => setTourGuide(DefaultTourGuideState), [setTourGuide]);
};
