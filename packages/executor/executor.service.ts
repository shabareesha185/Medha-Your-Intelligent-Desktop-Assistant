import { registry } from "../registry/registry.ts";

export async function execute(action: string, params: any) {
  const tool = registry[action as keyof typeof registry];

  if (!tool) {
    throw new Error(`Unknown action: ${action}`);
  }

  return tool.execute(params);
}
