import type { OrchestratorPlugin, PluginBridge } from '@ama-work/plugin-contract';
import { consolePanel } from './panels';

const plugin: OrchestratorPlugin = {
  id: 'ama-hello-world',
  async onStart(bridge: PluginBridge) {
    bridge.logger.info('ama-hello-world plugin started');
  },
  async onStop() {
    // cleanup
  },
};

export { consolePanel };
export default plugin;
