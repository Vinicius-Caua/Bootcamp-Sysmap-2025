import axios from 'axios';

export const ipAddress = '192.168.15.4';

const baseURL = `http://${ipAddress}:3000`;

export function getHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
}

export default axios.create({
  baseURL,
});
