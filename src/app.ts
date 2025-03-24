import 'dotenv/config';
import { envs } from './config';
import { AppRoutes, Server } from './presentation';

(() => {
  main();
})();

async function main() {
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
