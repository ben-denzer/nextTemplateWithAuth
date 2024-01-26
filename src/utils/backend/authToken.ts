'use server';
import jwt from 'jsonwebtoken';
import prisma from './db';
import { LogMetadata, Logger } from '../logger/Logger';

const AUTH_TOKEN_EXPIRATION = '1m';

export interface AuthTokenData {
  userId: number;
}

const signJwt = (data: AuthTokenData): Promise<string> => {
  const method = 'authToken.signJwt';
  const metadata: LogMetadata = data;
  return new Promise((resolve, reject) => {
    Logger.debug(method, 'signing jwt', metadata);
    jwt.sign(
      data,
      process.env.JWT_SECRET as string,
      {
        expiresIn: AUTH_TOKEN_EXPIRATION,
      },
      (err, token) => {
        if (err) {
          Logger.error(method, 'caught', err, metadata);
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};

const verifyJwt = (token: string): Promise<AuthTokenData> => {
  const method = 'authToken.verifyJwt';
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        Logger.error(method, 'caught', err);
        reject(err);
      } else {
        resolve(decoded as AuthTokenData);
      }
    });
  });
};

export const generateAuthToken = async (data: AuthTokenData): Promise<string> => {
  const method = 'authToken.generateAuthToken';
  const metadata: LogMetadata = data;
  try {
    Logger.triggered(method, metadata);

    const token = await signJwt(data);
    Logger.debug(method, 'token signed', metadata);

    await prisma.userAuth.update({
      where: { id: Number(data.userId) },
      data: { token },
    });

    Logger.success(method, metadata);
    return token;
  } catch (err) {
    Logger.error(method, 'caught', err);
    throw err;
  }
};

export const verifyAuthToken = async (token?: string | undefined | null): Promise<AuthTokenData> => {
  try {
    if (!token) {
      throw new AuthError('no token provided');
    }

    const verifiedFromClient = await verifyJwt(token);
    if (!verifiedFromClient.userId) {
      throw new AuthError('invalid token');
    }

    const dbToken = await prisma.userAuth.findFirst({
      where: { id: verifiedFromClient.userId },
      select: { token: true },
    });
    if (!dbToken?.token) {
      throw new AuthError('no token in DB');
    }

    if (dbToken.token !== token) {
      throw new AuthError('token mismatch');
    }

    return verifiedFromClient;
  } catch (err) {
    throw err;
  }
};
