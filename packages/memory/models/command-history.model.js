import mongoose from "mongoose";

const commandHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    params: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },

    result: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const CommandHistory = mongoose.model(
  "CommandHistory",
  commandHistorySchema,
);
