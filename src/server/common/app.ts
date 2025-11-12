import type { Env } from 'hono';

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

import { passportInitialize } from '../auth/utils';

export function createHonoApp<E extends Env>() {
  const app = new Hono<E>();

  app.use(prettyJSON());
  app.use('*', passportInitialize());

  return app;
}
