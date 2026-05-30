import { registry } from "../registry/registry.js";

export async function execute(action, params) {
  const tool = registry[action];

  if (!tool) {
    throw new Error(`Unknown action: ${action}`);
  }

  return tool.execute(params);
}
