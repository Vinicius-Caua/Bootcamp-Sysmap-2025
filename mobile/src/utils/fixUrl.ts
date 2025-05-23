
import {ipAddress} from '../api/api';

export const fixUrl = (url: string | undefined | null): string | undefined => {
  if (!url) {
    return undefined;
  }

  // Replace 'localhost' with ip address for local development
  if (url.includes('localhost')) {
    return url.replace('localhost', ipAddress);
  }

  return url;
};
