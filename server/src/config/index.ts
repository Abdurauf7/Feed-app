import * as dotenv from 'dotenv';

dotenv.config();

type configType = {
  APP: {
    PORT: number | undefined;
    NODE_ENV: string | undefined;
    JWT_SECRET: string | undefined;
    SESSION_TIMEOUT: string | undefined;
  };
  DB: {
    HOST: string | undefined;
    USER: string | undefined;
    PASSWORD: string | undefined;
    PORT: number | undefined;
    DATABASE: string | undefined;
  };
};

const config: configType = {
  APP: {
    PORT: Number(process.env.APP_PORT),
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_TIMEOUT: process.env.TOKEN_SESSION_TIMEOUT,
  },
  DB: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: Number(process.env.DB_PORT),
    DATABASE: process.env.DB_NAME,
  },
};

export default config;
