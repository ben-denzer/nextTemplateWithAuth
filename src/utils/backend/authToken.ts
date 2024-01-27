'use server';
import * as jose from 'jose';
import { prisma } from './prisma';
import { LogMetadata, Logger } from '../logger/Logger';
import { AuthError } from '@/models/errors/AuthError';
import { AUTH_TOKEN_COOKIE_NAME } from '@/models/constants';

const AUTH_TOKEN_EXPIRATION = '5m';
const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
const algorithm = 'HS256';

export interface AuthTokenData {
  userId: number;
  tokenType: 'login' | 'forgotPassword';
}

const signJwt = async (data: AuthTokenData): Promise<string> => {
  const method = 'authToken.signJwt';
  const metadata: LogMetadata = data;
  Logger.debug(method, 'signing jwt', metadata);

  const token = await new jose.SignJWT({ data })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(AUTH_TOKEN_EXPIRATION)
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
    Logger.error(method, 'caught', err);
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
} => {
  return {
    name: AUTH_TOKEN_COOKIE_NAME,
    value: authToken,
    httpOnly: true,
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
    Logger.triggered(method, metadata);

    const token = await signJwt(data);
    Logger.debug(method, 'token signed', metadata);

    await prisma.authToken.create({
      data: {
        user: { connect: { id: data.userId } },
        token,
        tokenType: data.tokenType,
      },
    });

    Logger.success(method, metadata);
    return token;
  } catch (err) {
    Logger.error(method, 'caught', err);
    throw err;
  }
};

export const verifyAuthToken = async (
  token?: string | undefined | null
): Promise<AuthTokenData> => {
  try {
    if (!token) {
      throw new AuthError('no token provided');
    }

    const verifiedFromClient = await verifyJwt(token);
    if (!verifiedFromClient.userId) {
      throw new AuthError('invalid token');
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
  } catch (err) {
    throw err;
  }
};
