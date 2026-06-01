import { sleepMode } from "../../automation/sleep-mode.js";
import { SleepModeSchema } from "../../schemas/sleep-mode.schema.js";

export class SleepModeTool {
  schema = SleepModeSchema;

  async execute() {
    return sleepMode();
  }
}
