// import "dotenv/config";
import { config } from "dotenv";
import cluster from "cluster";
import { cpus } from "os";
import http from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// config({ path: join(__dirname, "..") });
config({
  path: join(process.env.PWD.split("/").slice(0, -1).join("/"), ".env"),
});

const port = process.env.PORT || "8080";
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  const server = http.createServer(app);
  server.listen(port);

  logger.info(`Worker ${process.pid} started`);
}
logger.info(`api listening on port ${port}`);
// export default server;
