import type { OrchestratorPlugin, PluginBridge } from '@ama-work/plugin-contract';
import { consolePanel } from './panels/index.js';
import { createPluginRouter } from './plugin.route.js';

export const plugin: OrchestratorPlugin = {
  id: 'ama-hello-world',
  async onStart(bridge: PluginBridge) {
    bridge.mountConsolePanel(consolePanel);
    bridge.mountRoutes(createPluginRouter());
    bridge.logger.info('ama-hello-world plugin started');
  },
  async onStop() {
    // cleanup
  },
};

export { consolePanel };
export default plugin;
