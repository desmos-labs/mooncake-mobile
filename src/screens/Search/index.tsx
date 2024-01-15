import { usePostsListState } from '@recoil/screens/postsListState';
import React from 'react';
import SearchViewComponent from 'screens/Search/components/SearchUsers';

const SearchUsers = () => {
  const listState = usePostsListState();
  return <SearchViewComponent valueToSearch={listState.valueToSearch} />;
};

export default SearchUsers;
