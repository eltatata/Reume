import { envs } from '../adapters/envs.adapter';
import swaggerJSDoc from 'swagger-jsdoc';

const apiPath =
  envs.NODE_ENV === 'development'
    ? './src/presentation/routes.ts'
    : './dist/presentation/routes.js';

const options: swaggerJSDoc.Options = {
  definition: {
    info: {
      version: '1.0.0',
      title: 'Reume - Swagger API Documentation',
      description: 'This is the API documentation for the Reume application.',
    },
  },
  apis: [apiPath],
};

export const swaggerSpec = swaggerJSDoc(options);
