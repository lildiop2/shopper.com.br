import { should, expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Measure } from "../src/models/database.js";
import { randomUUID } from "crypto";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE_URL = `/api/v1`;
const data = readFileSync(join(__dirname, "test.jpeg"), "base64");
const base64 = `data:image/jpeg;base64,${data}`;

const VALID_UPLOAD_BODY = {
  image: base64,
  customer_code: "123ssf45",
  measure_datetime: "2024-08-01",
  measure_type: "WATER",
};

const INVALID_UPLOAD_BODY = {
  image: "invalid_base64",
  customer_code: 12345,
  measure_datetime: "not a date",
  measure_type: "INVALID",
};

let measure_uuid = "";
let confirmed_value = 90;

before(async () => {
  await Measure.deleteMany({});
  return 200;
});

describe(`POST ${BASE_URL}/upload `, () => {
  it(`should return 200 and the correct response when the data is valid`, async () => {
    const res = await request(app)
      .post(`${BASE_URL}/upload`)
      .send(VALID_UPLOAD_BODY);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("image_url").that.is.a("string");
    expect(res.body).to.have.property("measure_value").that.is.a("number");
    expect(res.body).to.have.property("measure_uuid").that.is.a("string");
    measure_uuid = res.body.measure_uuid;
  });

  it(`should return 400 when data is invalid`, async () => {
    const res = await request(app)
      .post(`${BASE_URL}/upload`)
      .send(INVALID_UPLOAD_BODY);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error_code", "INVALID_DATA");
    expect(res.body).to.have.property("error_description");
  });

  it(`should return 409 when a report for the same month and type already exists`, async () => {
    const res = await request(app)
      .post(`${BASE_URL}/upload`)
      .send(VALID_UPLOAD_BODY);
    expect(res.status).to.equal(409);
    expect(res.body).to.have.property("error_code", "DOUBLE_REPORT");
    expect(res.body).to.have.property(
      "error_description",
      "Leitura do mês já realizada"
    );
  });
});

describe(`PATCH ${BASE_URL}/confirm`, () => {
  it("should return 200 and success when the data is valid and measure is not already confirmed", async () => {
    const res = await request(app).patch(`${BASE_URL}/confirm`).send({
      measure_uuid: measure_uuid,
      confirmed_value: confirmed_value,
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return 400 when data is invalid", async () => {
    const res = await request(app).patch(`${BASE_URL}/confirm`).send({
      measure_uuid: 12345, // Invalid measure_uuid type
      confirmed_value: "not a number", // Invalid confirmed_value type
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error_code", "INVALID_DATA");
    expect(res.body).to.have.property("error_description");
  });

  it("should return 404 when the measure is not found", async () => {
    const res = await request(app).patch(`${BASE_URL}/confirm`).send({
      measure_uuid: randomUUID(),
      confirmed_value: 12345,
    });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error_code", "MEASURE_NOT_FOUND");
    expect(res.body).to.have.property(
      "error_description",
      "Leitura do mês já realizada"
    );
  });

  it("should return 409 when the measure is already confirmed", async () => {
    const res = await request(app).patch(`${BASE_URL}/confirm`).send({
      measure_uuid: measure_uuid,
      confirmed_value: confirmed_value,
    });

    expect(res.status).to.equal(409);
    expect(res.body).to.have.property("error_code", "CONFIRMATION_DUPLICATE");
    expect(res.body).to.have.property(
      "error_description",
      "Leitura do mês já realizada"
    );
  });
});

describe("GET /:customer_code/list", () => {
  it("should return 400 when the measure_type query parameter is invalid", async () => {
    const res = await request(app).get(
      `${BASE_URL}/${VALID_UPLOAD_BODY.customer_code}/list?measure_type=INVALID_TYPE`
    );
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error_code", "INVALID_TYPE");
    expect(res.body).to.have.property(
      "error_description",
      "Tipo de medição não permitida"
    );
  });

  it("should return 404 when no measures are found for the given customer", async () => {
    const res = await request(app).get(
      `${BASE_URL}/non_existent_customer_code/list`
    );

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error_code", "MEASURES_NOT_FOUND");
    expect(res.body).to.have.property(
      "error_description",
      "Nenhuma leitura encontrada"
    );
  });

  it("should return 200 and all measures when no measure_type is provided", async () => {
    const res = await request(app).get(
      `${BASE_URL}/${VALID_UPLOAD_BODY.customer_code}/list`
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "customer_code",
      VALID_UPLOAD_BODY.customer_code
    );
    expect(res.body).to.have.property("measures").that.is.an("array");

    if (res.body.measures.length > 0) {
      expect(res.body.measures[0]).to.have.all.keys(
        "measure_uuid",
        "measure_datetime",
        "measure_type",
        "has_confirmed",
        "image_url"
      );
    }
  });

  it("should return 200 and filtered measures when a valid measure_type is provided", async () => {
    const res = await request(app).get(
      `${BASE_URL}/${VALID_UPLOAD_BODY.customer_code}/list?measure_type=WATER`
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "customer_code",
      VALID_UPLOAD_BODY.customer_code
    );
    expect(res.body).to.have.property("measures").that.is.an("array");

    if (res.body.measures.length > 0) {
      res.body.measures.forEach((measure) => {
        expect(measure).to.have.property("measure_type", "WATER");

        expect(res.body.measures[0]).to.have.all.keys(
          "measure_uuid",
          "measure_datetime",
          "measure_type",
          "has_confirmed",
          "image_url"
        );
      });
    }
  });
});

after(async () => {
  await Measure.deleteMany({});
  return 200;
});
