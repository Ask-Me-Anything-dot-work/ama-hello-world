import { Hono } from 'hono';
import { helloWorldHtml } from './panels/template.js';

export function createPluginRouter(): Hono {
  const router = new Hono();
  router.get('/hello-world.html', (c) => c.html(helloWorldHtml));
  return router;
}
