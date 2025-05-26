import cors, { CorsOptions } from 'cors';
import { envs } from './envs.adapter';

export const corsAdapter = () => {
  const whitelist = [envs.REUME_FRONTEND_URL, envs.ORIGIN_URL];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Acceso denegado por CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  };

  return cors(corsOptions);
};
