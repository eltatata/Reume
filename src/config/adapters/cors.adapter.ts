import cors, { CorsOptions } from 'cors';

export const corsAdapter = () => {
  const whitelist = [process.env.REUME_FRONTEND_URL, process.env.ORIGIN_URL];

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
