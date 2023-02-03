import { ButterConfig } from 'types/butter';

/**
 * Format an incoming Butter config data from the server into a format that is easier to parse by the app.
 * @param {any} config - Config fetched from the server.
 * @returns {ProfileParams} - A formatted ButterConfig object
 */
export const convertGraphQLButterConfig = (config: any) =>
  ({
    desmosAddress: config.desmos_address,
    ibc: {
      channel: config.ibc.channel,
      port: config.ibc.port,
    },
    invites: {
      requiredImpactPoints: config.invites.required_impact_points,
    },
  } as ButterConfig);
