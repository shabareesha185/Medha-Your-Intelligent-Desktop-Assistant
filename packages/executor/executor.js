import { registry } from "../registry/registry.js";

export async function execute(action, params) {
  const tool = registry[action];

  if (!tool) {
    throw new Error(`Unknown action: ${action}`);
  }

  if (tool.schema) {
    tool.schema.parse(params);
  }

  return tool.execute(params);
}
