'use server';
import * as jose from 'jose';
import { prisma } from './prisma';
import { Logger } from '../logger/Logger';
import { AuthError } from '@/models/errors/AuthError';
import { AUTH_TOKEN_COOKIE_NAME, JWT_SECRET } from '@/models/constants';
import { TokenType } from '@prisma/client';
import { LogMetadata } from '@/models/LogInfo';

const AUTH_TOKEN_EXPIRATION_DAYS = 1;
const AUTH_TOKEN_EXPIRATION = `${AUTH_TOKEN_EXPIRATION_DAYS}d`;
const FORGOT_PW_TOKEN_EXPIRATION = '3d';

const secret = new TextEncoder().encode(JWT_SECRET);
const algorithm = 'HS256';

export interface AuthTokenData {
  userId: number;
  tokenType: TokenType;
}

const signJwt = async (data: AuthTokenData): Promise<string> => {
  const method = 'authToken.signJwt';
  const metadata: LogMetadata = data;
  Logger.debug(method, 'signing jwt', metadata);

  const expiration =
    data.tokenType === 'login'
      ? AUTH_TOKEN_EXPIRATION
      : FORGOT_PW_TOKEN_EXPIRATION;

  const token = await new jose.SignJWT({ data })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secret);

  Logger.debug(method, 'jwt signed', metadata);
  return token;
};

const verifyJwt = async (token: string): Promise<AuthTokenData> => {
  const method = 'authToken.verifyJwt';
  Logger.debug(method, 'verifying jwt');

  if (!token) {
    throw new AuthError('no token provided');
  }

  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [algorithm],
    });
    return payload.data as AuthTokenData;
  } catch (err) {
    Logger.debug(method, 'caught - invalid token');
    throw new AuthError('invalid token');
  }
};

export const authCookieOptions = (
  authToken: string
): {
  name: string;
  value: string;
  httpOnly: boolean;
  sameSite: 'strict';
  secure: boolean;
  path: string;
  maxAge: number;
} => {
  return {
    name: AUTH_TOKEN_COOKIE_NAME,
    value: authToken,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * AUTH_TOKEN_EXPIRATION_DAYS,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',

    path: '/',
  };
};

export const generateAuthToken = async (
  data: AuthTokenData
): Promise<string> => {
  const method = 'authToken.generateAuthToken';
  const metadata: LogMetadata = data;
  try {
    const token = await signJwt(data);
    Logger.debug(method, 'token signed', metadata);

    await prisma.authToken.create({
      data: {
        user: { connect: { id: data.userId } },
        token,
        tokenType: data.tokenType,
      },
    });

    return token;
  } catch (err) {
    Logger.error(method, 'caught', err);
    throw err;
  }
};

export const verifyAuthToken = async (
  token: string | undefined | null,
  tokenType: TokenType
): Promise<AuthTokenData> => {
  if (!token) {
    throw new AuthError('no token provided');
  }

  const verifiedFromClient = await verifyJwt(token);
  if (!verifiedFromClient.userId) {
    throw new AuthError('invalid token');
  }

  if (verifiedFromClient.tokenType !== tokenType) {
    throw new AuthError('invalid token type');
  }

  const dbToken = await prisma.authToken.findFirst({
    where: {
      token,
      tokenType: verifiedFromClient.tokenType,
      userId: verifiedFromClient.userId,
    },
    select: { id: true },
  });
  if (!dbToken?.id) {
    throw new AuthError('no token in DB');
  }

  return verifiedFromClient;
};

export async function cleanupAuthTokens(userId: number) {
  const method = 'authToken.cleanupAuthTokens';
  const metadata: LogMetadata = { userId };

  try {
    const allTokens = await prisma.authToken.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        token: true,
        tokenType: true,
      },
    });

    Logger.debug(
      'cleanupAuthTokens',
      `found ${allTokens?.length} tokens`,
      metadata
    );

    const tokensToDelete = [];

    for (const t of allTokens) {
      try {
        if (t.tokenType !== 'login') {
          tokensToDelete.push(t.id);
          continue;
        }
        await verifyJwt(t.token);
        // if valid, do nothing
      } catch (err) {
        // if invalid, delete
        tokensToDelete.push(t.id);
      }
    }

    if (tokensToDelete.length === 0) {
      Logger.debug(method, 'no tokens to delete', metadata);
      return;
    }

    await prisma.authToken.deleteMany({
      where: {
        id: {
          in: tokensToDelete,
        },
      },
    });
  } catch (err) {
    Logger.error(method, 'caught', err);
    throw err;
  }
}
