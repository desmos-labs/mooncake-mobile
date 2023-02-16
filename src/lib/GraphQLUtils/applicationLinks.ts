import { applicationLinkStateFromJSON } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';
import { ApplicationLink } from 'types/desmos';

/**
 * Format an incoming application link data from the server into a format that is easier to parse by the app.
 * @param {any} applicationLink - Application link data retrieved from the server.
 * @return {ApplicationLink} - A formatted ApplicationLink object.
 */
// It's fine to ignore the default export warning here since we might add other functions in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLApplicationLink = (applicationLink: any) =>
  ({
    application: applicationLink.application,
    creationTime: new Date(Date.parse(applicationLink.creationTime)),
    state: applicationLinkStateFromJSON(applicationLink.state),
    username: applicationLink.username,
  } as ApplicationLink);
