import jwt from 'jsonwebtoken';

export interface AuthTokenData {
  userId: string;
}

export const generateAuthToken = (data: AuthTokenData): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d',
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

export const verifyAuthToken = (token: string): AuthTokenData => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenData;
};
