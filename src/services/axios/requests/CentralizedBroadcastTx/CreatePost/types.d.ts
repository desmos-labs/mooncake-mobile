export {};

declare global {
  type CreatePostParams = {
    text: string;

    conversationId?: number;

    // temporary
    postReferences?: any[];
  };
}
