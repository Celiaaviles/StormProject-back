import { WithId } from '../types/id.js';
import { Storm } from './storm.entities.js';

export type Login = {
  userName: string;
  passwd: string;
};

export type UserNoId = Login & {
  email: string;
  city: string;
  storms: Storm[];
};

export type User = WithId & UserNoId;
