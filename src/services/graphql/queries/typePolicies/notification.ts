// Custom merge function for post.read_receipts
// replace existing data with incoming data

const NotificationMergePolicy = {
  notification: {
    fields: {
      read_receipts: {
        merge(existing: any[], incoming: any[]) {
          return incoming;
        },
      },
    },
  },
};

export default NotificationMergePolicy;
