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

/**
 * Format an incoming profile data from the server into a format that is easier to parse by the app.
 * @param {any} profile - Desmos Profile data fetched from the server.
 * @returns {ProfileParams} - A formatted DesmosProfile object
 */
export const convertGraphQLProfile = (profile: any) =>
  ({
    dTag: profile.dtag,
    address: profile.address,
    bio: profile.bio,
    profilePicture: profile.profile_picture,
    coverPicture: profile.cover_picture,
    nickname: profile.nickname,
  } as DesmosProfile);
