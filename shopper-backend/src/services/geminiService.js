import {
  NotFoundError,
  UnprocessableEntityError,
  ValidationError,
} from "../utils/error.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFileSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
});

import { GoogleAIFileManager } from "@google/generative-ai/server";

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

class GeminiService {
  extractMeasureValue = async (measure) => {
    const { image, _id } = measure;
    const matches = image.match(/^data:(.*?);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 string");
    }

    // Extract MIME type
    const mimeType = matches[1];
    const extension = mimeType.split("/")[1]; // Get the file extension from MIME type
    const filename = `${_id}.${extension}`;
    const path = join(__dirname, "..", "..", "images", filename);
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    writeFileSync(path, base64Data, "base64");
    // Upload the file and specify a display name.
    const uploadResponse = await fileManager.uploadFile(path, {
      mimeType: mimeType,
      displayName: filename,
    });
    unlinkSync(path);
    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: "extract the measure value on the image and return the measure like a integer value.",
      },
    ]);
    return {
      image_url: uploadResponse.file.uri,
      measure_value: result.response.text(),
    };
  };
}

export default new GeminiService();
