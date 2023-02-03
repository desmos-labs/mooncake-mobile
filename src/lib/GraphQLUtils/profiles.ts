import { DesmosProfile, ProfileParams } from 'types/desmos';

/**
 * Format an incoming profiles params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos Profiles params fetched from the server.
 * @returns {ProfileParams} - A formatted ProfileParams object
 */
export const convertGraphQLProfileParams = (params: any) =>
  ({
    dTag: {
      maxLength: params.dtag.max_length,
      minLength: params.dtag.min_length,
      regEx: params.dtag.reg_ex,
    },
    nickname: {
      minLength: params.nickname.min_length,
      maxLength: params.nickname.max_length,
    },
    bio: {
      maxLength: params.bio.max_length,
    },
  } as ProfileParams);

export const convertGraphQLProfile = (profile: any) => profile as DesmosProfile;
