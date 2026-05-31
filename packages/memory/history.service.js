import { CommandHistory } from "./models/command-history.model.js";

export async function saveCommand({ action, params, status, result }) {
  return CommandHistory.create({
    action,
    params,
    status,
    result,
  });
}
