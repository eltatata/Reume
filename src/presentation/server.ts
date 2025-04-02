import express, { Router, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { envs, swaggerSpec } from '../config';
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

    if (envs.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use(this.routes);

    this.app.use(
      (err: unknown, req: Request, res: Response, next: NextFunction) => {
        ErrorHandlerService.handleError(err, res);
        next();
      },
    );

    this.serverListener = this.app.listen(this.port, () => {
      console.log(
        envs.NODE_ENV === 'development'
          ? `Server running on http://localhost:${this.port}`
          : `Server running`,
      );
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
