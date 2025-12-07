
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app';
import setupDB from './db/setupDB';

setupDB().then(() => console.log('Database ready')).catch(console.error);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}
