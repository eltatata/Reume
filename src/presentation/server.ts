import express, { Router, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { envs, swaggerSpec, logger, morganAdapter } from '../config';
import { ErrorHandlerService } from './';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: import('http').Server;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;

    this.port = port;
    this.routes = routes;
  }

  start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(morganAdapter());

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use(this.routes);

    this.app.use(
      (err: unknown, req: Request, res: Response, next: NextFunction) => {
        ErrorHandlerService.handleError(err, res);
        next();
      },
    );

    this.serverListener = this.app.listen(this.port, () => {
      if (envs.NODE_ENV !== 'test') {
        logger.info(
          envs.NODE_ENV === 'development'
            ? `Server running at http://localhost:${this.port}`
            : `Server running on port ${this.port}`,
        );
      }
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
