import { unlink } from 'fs';
import { join } from 'path';

export const clearImage = (filePath: string) => {
  filePath = join(__dirname, '../../', filePath);
  unlink(filePath, (err) => console.log(err));
};

export const errorsHandler = (status: number, message?: string | null) => {
  switch (status) {
    case 500:
      return {
        status,
        type: 'ServerError',
        message: { en: 'Internal server error' },
        error: message,
      };
    case 404:
      return {
        status,
        type: 'NotFound',
        message: { en: 'Not Found' },
        error: message,
      };
    case 403:
      return {
        status,
        type: 'Not authorized!',
        message: { en: 'Not authorized!' },
        error: message,
      };
    default:
      return {
        status,
        type: 'ServerError',
        message: { en: 'Internal server error' },
        error: message,
      };
  }
};
