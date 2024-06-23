namespace NodeJs {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    APP_PORT: number;
    TOKEN_SECRET: string;
    TOKEN_SESSION_TIMEOUT: string;
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_NAME: string;
  }
}

declare namespace e {
  export interface Request {
    userId?: any;
    file?: e.Multer.File;
  }
}
