import mongoose from "mongoose";

/**
 * Image sub-schema
 */
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  }
});

/**
 * Project schema
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [imageSchema],
      validate: [arrayLimit, "Maximum 5 images allowed"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Limit images to max 5
 */
function arrayLimit(val) {
  return val.length <= 5;
}

export default mongoose.model("Project", projectSchema);
