import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { SearchItem } from 'types/searchHistory';

const searchHistory = atom<SearchItem[]>({
  key: 'searchHistory',
  default: getMMKV(MMKVKEYS.SEARCH_HISTORY) || [],
  effects: [
    ({ onSet }) => {
      onSet(newSearches => {
        setMMKV(MMKVKEYS.SEARCH_HISTORY, newSearches);
      });
    },
  ],
});

const useSearchHistory = () => useRecoilValue(searchHistory);

export const useStoreSearchHistory = () => useSetRecoilState(searchHistory);

export const useOrderedSearchHistory = () => {
  const searches = useSearchHistory();
  return [...searches].sort((a, b) => b.searchDate.getTime() - a.searchDate.getTime());
};
