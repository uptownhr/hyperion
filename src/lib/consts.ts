import { Method } from 'axios';

export interface httpCheckAssertion {
  status: number;
  body?: string;
}

export interface httpCheck {
  url: string;
  method: Method;
  assertion: httpCheckAssertion;
}

export const redisOptions = {
  port: 6379,
  host: 'localhost',
};