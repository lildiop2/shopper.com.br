import { Measure } from "../models/database.js";
import { randomUUID } from "crypto";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
  ValidationError,
} from "../utils/error.js";
import geminiService from "./geminiService.js";

class MeasureService {
  createNewMeasure = async (measure) => {
    const { image, customer_code, measure_datetime, measure_type } = measure;
    const existingMeasure = await Measure.findOne({
      measure_type,
      measure_datetime,
    }); // check if measure already exists
    if (existingMeasure)
      throw new ConflictError(
        JSON.stringify({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        })
      );

    const _id = randomUUID();
    let { image_url, measure_value } = await geminiService.extractMeasureValue({
      _id,
      image,
    });
    measure_value = parseInt(measure_value.replace(/[^0-9]/g, ""));
    const createdMeasure = await Measure.create({
      _id,
      measure_value,
      image_url,
      customer_code,
      measure_datetime,
      measure_type,
    });

    return {
      image_url,
      measure_value,
      measure_uuid: createdMeasure._id,
    };
  };
  getAllMeasures = async (query) => {
    let { measure_type, customer_code } = query;
    // Filter measures based on query parameters
    let filteredMeasures = await Measure.find(
      { customer_code },
      "_id measure_datetime measure_type has_confirmed image_url" // select only necessary fields
    );

    if (!!measure_type) {
      filteredMeasures = filteredMeasures.filter(
        (measure) => measure.measure_type === measure_type
      );
    }
    if (filteredMeasures?.length <= 0)
      throw new NotFoundError(
        JSON.stringify({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        })
      );
    return {
      customer_code,
      measures: filteredMeasures.map((measure) => {
        const {
          _id,
          image_url,
          measure_datetime,
          has_confirmed,
          measure_type,
        } = measure;
        return {
          measure_uuid: _id,
          image_url,
          measure_datetime,
          has_confirmed,
          measure_type,
        };
      }),
    };
  };
  updateOneMeasure = async (measure) => {
    const { measure_uuid: _id, confirmed_value } = measure;
    const existingMeasure = await Measure.findById(_id, {
      createdAt: 0,
      updatedAt: 0,
    });
    if (!existingMeasure)
      throw new NotFoundError(
        JSON.stringify({
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura do mês já realizada",
        })
      );
    if (existingMeasure.has_confirmed)
      throw new ConflictError(
        JSON.stringify({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura do mês já realizada",
        })
      );
    await Measure.findByIdAndUpdate(
      _id,
      { has_confirmed: true, measure_value: confirmed_value },
      {
        new: true,
        select: {
          createdAt: 0,
          updatedAt: 0,
        },
      }
    );
    return {
      success: true,
    };
  };
}

export default new MeasureService();
