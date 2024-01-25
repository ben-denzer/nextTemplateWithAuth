'use server';
import jwt from 'jsonwebtoken';
import prisma from './db';

const AUTH_TOKEN_EXPIRATION = '1m';

export interface AuthTokenData {
  userId: string;
}

const signJwt = (data: AuthTokenData): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_SECRET as string,
      {
        expiresIn: AUTH_TOKEN_EXPIRATION,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};

const verifyJwt = (token: string): Promise<AuthTokenData> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as AuthTokenData);
      }
    });
  });
};

export const generateAuthToken = async (data: AuthTokenData): Promise<string> => {
  try {
    const token = await signJwt(data);
    await prisma.userAuth.update({
      where: { id: Number(data.userId) },
      data: { token },
    });

    return token;
  } catch (err) {
    throw err;
  }
};

export const verifyAuthToken = async (token: string): Promise<AuthTokenData> => {
  try {
    const verifiedFromClient = await verifyJwt(token);
    if (!verifiedFromClient.userId) {
      throw new AuthError('invalid token');
    }

    const dbToken = await prisma.userAuth.findFirst({
      where: { id: Number(verifiedFromClient.userId) },
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
