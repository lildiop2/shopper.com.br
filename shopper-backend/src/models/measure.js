import { randomUUID } from "crypto";
import { type } from "os";
export default (model, Schema) => {
  const MeasureSchema = new Schema(
    {
      _id: { type: "UUID", default: () => randomUUID() }, // Unique identifier
      image_url: { type: String, required: true },
      customer_code: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      measure_value: { type: Number },
      measure_datetime: { type: Date, required: true },
      has_confirmed: { type: Boolean, default: false },
      measure_type: {
        type: String,
        uppercase: true,
        trim: true,
        enum: ["WATER", "GAS"],
        required: true,
      },
    },
    { timestamps: true, versionKey: false }
  );

  const Measure = model("Measure", MeasureSchema);

  return Measure;
};
