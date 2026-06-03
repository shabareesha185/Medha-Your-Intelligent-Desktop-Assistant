import { registry } from "../registry/registry.js";
import { saveCommand } from "../memory/history.service.js";

export async function execute(action, params, commandText = "") {
  try {
    const tool = registry[action];

    if (!tool) {
      throw new Error(`Unknown action: ${action}`);
    }

    if (tool.schema) {
      tool.schema.parse(params);
    }

    const result = await tool.execute(params);

    await saveCommand({
      action,
      params,
      commandText,
      status: "success",
      result: result.message || "",
    });

    return result;
  } catch (error) {
    await saveCommand({
      action,
      params,
      commandText,
      status: "failed",
      result: error.message,
    });

    throw error;
  }
}
