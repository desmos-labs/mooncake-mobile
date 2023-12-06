import { PastTransactionMessage } from 'types/transactions';
import { SectionBase } from 'react-native';
import usePastTransactions from 'hooks/transactions/usePastTransactions';
import { getDate } from 'date-fns';

/**
 * Type that contains the details of a single section of the list of past actions.
 */
export interface MessagesSection extends SectionBase<PastTransactionMessage> {
  readonly title: string;
  readonly timestamp: string;
  readonly data: PastTransactionMessage[];
}

/**
 * Function that allows to split the given {@link PastTransactionMessage} into different {@link MessagesSection},
 * each one having:
 * - the `title` equals to the data inside which such messages where executed
 * - the `data` containing all the messages that were included inside a transaction having such date.
 */
const groupMessagesByDate = (messages: PastTransactionMessage[]) => {
  const sections: MessagesSection[] = [];
  messages.forEach(message => {
    const sectionIndex = sections.findIndex(
      section => getDate(new Date(section.timestamp)) === getDate(new Date(message.timestamp)),
    );
    if (sectionIndex === -1) {
      sections.push({
        title: message.timestamp,
        data: [message],
        timestamp: message.timestamp,
      });
    } else {
      sections[sectionIndex].data.push(message);
    }
  });
  return sections;
};

/**
 * Hook that returns the list of past actions of a user, grouped by date.
 * @param address {string} - Address of the user whose past actions we want to retrieve.
 * @param transactionsPerPage {number} - Number of tx to retrieve per page.
 */
export const usePastActionsSections = (address: string, transactionsPerPage: number = 20) => {
  const {
    transactions,
    loading,
    fetchMore: fetchMoreTransactions,
    fetchingMore,
    refetch: refetchTransactions,
    refreshing,
  } = usePastTransactions(address, transactionsPerPage);

  return {
    sections: groupMessagesByDate(transactions),
    loading,
    fetchMore: fetchMoreTransactions,
    fetchingMore,
    refetch: refetchTransactions,
    refreshing,
  };
};
