import { PastTransactionMessage } from 'types/transactions';
import { SectionBase } from 'react-native';

/**
 * Type that contains the details of a single section of the list of past actions.
 */
export interface MessagesSection extends SectionBase<PastTransactionMessage> {
  readonly title: string;
  readonly data: PastTransactionMessage[];
}

/**
 * Hook that returns the list of past actions of a user, grouped by date.
 * @param address {string} - Address of the user whose past actions we want to retrieve.
 * TODO: Implement this
 */
export const usePastActionsSections = (address: string) => {
  return {
    sections: [] as MessagesSection[],
    loading: false,
    fetchMore: () => {},
    fetchingMore: false,
    refetch: () => {},
    refreshing: false,
  };
};
