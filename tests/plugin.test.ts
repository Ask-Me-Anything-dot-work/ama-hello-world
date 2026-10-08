import { expect, test, describe } from 'bun:test';
import { MockBridge } from '@ama-work/plugin-contract';
import type { Hono } from 'hono';
import * as mod from '../src/index.js';
import { createPluginRouter } from '../src/plugin.route.js';

const plugin = mod.plugin;
const consolePanel = mod.consolePanel;

describe('Plugin', () => {
  test('satisfies orchestrator export contract', () => {
    expect(mod.plugin).toBeDefined();
    expect(typeof mod.plugin.id).toBe('string');
    expect(typeof mod.plugin.onStart).toBe('function');
    expect(typeof mod.plugin.onStop).toBe('function');
    expect(mod.default).toBe(mod.plugin);
  });

  test('has correct id', () => {
    expect(plugin.id).toBe('ama-hello-world');
  });

  test('onStart mounts console panel', async () => {
    const bridge = new MockBridge();
    bridge.mountRoutes = () => {};

    await plugin.onStart(bridge);

    expect(bridge.mountedPanels).toHaveLength(1);
    const panel = bridge.mountedPanels[0];
    expect(panel).toEqual({
      id: 'ama-hello-world-console',
      navLabel: 'ama-hello-world',
      icon: 'settings',
      mixinUrl: '',
      templateUrl: '/plugins/@ama-work/ama-hello-world/hello-world.html',
    });
  });

  test('onStart mounts plugin routes', async () => {
    const bridge = new MockBridge();
    let mounted: Hono | null = null;
    bridge.mountRoutes = (router: Hono) => {
      mounted = router;
    };

    await plugin.onStart(bridge);

    expect(mounted).not.toBeNull();
  });

  test('onStart logs startup message', async () => {
    const bridge = new MockBridge();
    const logs: string[] = [];
    bridge.logger.info = (msg: string) => logs.push(msg);
    bridge.mountRoutes = () => {};

    await plugin.onStart(bridge);
    expect(logs).toContain('ama-hello-world plugin started');
  });

  test('onStop completes without error', async () => {
    await expect(plugin.onStop()).resolves.toBeUndefined();
  });
});

describe('ConsolePanel', () => {
  test('templateUrl resolves under plugin route prefix', () => {
    expect(consolePanel.templateUrl.startsWith('/plugins/@ama-work/ama-hello-world/')).toBe(true);
  });
});

describe('Plugin routes', () => {
  test('serves hello world template', async () => {
    const router = createPluginRouter();
    const res = await router.request('/hello-world.html');
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('hello world');
  });
});
