import measureService from "../services/measureService.js";
import {
  body,
  param,
  validationResult,
  matchedData,
  query,
} from "express-validator";
import {
  NotFoundError,
  ValidationError,
  UnprocessableEntityError,
} from "../utils/error.js";

class MeasureController {
  //valide
  validate = (method) => {
    switch (method) {
      case "upload": {
        return [
          body("image").exists(),
          body("customer_code").isString(),
          body("measure_datetime").matches(
            /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
          ),
          body("measure_type").isIn(["WATER", "GAS"]),
        ];
      }
      case "confirm": {
        return [body("measure_uuid").isUUID(), body("confirmed_value").isInt()];
      }
      case "list": {
        return [
          param("customer_code").exists(),
          query("measure_type")
            .isIn(["WATER", "GAS"])
            .optional({ checkFalsy: true }),
        ];
      }
    }
  };
  list = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(
        JSON.stringify({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        })
      );
    }
    const { measure_type } = req.query;
    const { customer_code } = req.params;
    const allMeasures = await measureService.getAllMeasures({
      customer_code,
      measure_type,
    });
    return res.status(200).json(allMeasures);
  };

  upload = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(
        JSON.stringify({
          error_code: "INVALID_DATA",
          error_description: errors.array(),
        })
      );
    }
    const newMeasure = matchedData(req);
    const createdMeasure = await measureService.createNewMeasure(newMeasure);
    if (!!!createdMeasure) throw new UnprocessableEntityError();
    return res.status(200).json(createdMeasure);
  };
  confirm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(
        JSON.stringify({
          error_code: "INVALID_DATA",
          error_description: errors.array(),
        })
      );
    }
    const measure = matchedData(req);
    const updatedMeasure = await measureService.updateOneMeasure(measure);
    if (!!!updatedMeasure) throw new UnprocessableEntityError();
    return res.status(200).json(updatedMeasure);
  };
}

export default new MeasureController();
