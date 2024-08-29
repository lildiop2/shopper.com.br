import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { combine, timestamp, errors, splat, json } = format;
const removeTimestamp = format((info, opts) => {
  if (info.timestamp) {
    delete info.timestamp;
    return info;
  }
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      alias: "@timestamp",
    }),
    removeTimestamp(),
    errors({ stack: true }),
    splat(),
    json()
  ),
  defaultMeta: { service: "shopper-api" },
  transports: [
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
    new transports.DailyRotateFile({
      dirname: path.join(__dirname, "..", "..", "logs"),
      filename: "shopper-api-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}
export default logger;
