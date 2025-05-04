import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import { getEnvVar } from './getEnvVar.js';

const googleOAuthClient = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI'),
});

export const googleOAuth2 = () =>
  googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  try {
    const { tokens } = await googleOAuthClient.getToken(code);
    const { id_token: idToken } = tokens;
    if (!idToken) {
      throw createHttpError(401, 'Unauthorized');
    }

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken,
    });
    return ticket.getPayload();
  } catch (error) {
    console.log('error: ', error);
    throw createHttpError(401, 'Unauthorized');
  }
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }
  return fullName;
};
