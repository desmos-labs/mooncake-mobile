/**
 * @property {number} initSubspaceID - The subspace ID of the app.
 * @property {string} initUserAddress - The address of the user we want to display.
 * @property {number} initialTabIndex - The index of the tab that should be selected when the component
 * is first rendered.
 * @property {string} username - The username of the user whose followers you want to see.
 */
type FollowersParams = {
  initSubspaceID: number;
  initUserAddress: string;
  initialTabIndex: number;
  username: string;
};

export default FollowersParams;
