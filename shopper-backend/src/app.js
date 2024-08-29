import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { NotFoundError } from "./utils/error.js";
import errorHandler from "./middlewares/errorHandler.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

//aqui vão as variáveis de rotas
import v1MeasureRouter from "./v1/routes/measureRoute.js";
import v1RoleRouter from "./v1/routes/roleRoute.js";
import v1UserRouter from "./v1/routes/userRoute.js";
import logger from "./utils/logger.js";

// app.use(limiter);
//aplicando CORS
app.use(cors());
//we are configuring dist to serve site files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); //apenas dados simples
app.use(bodyParser.json({ limit: "50mb" })); // apenas json de entrada no body
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,"
  );
  // res.header("Cache-Control", "public, max-age=3600");
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS,GET,POST,PATCH,PUT,DELETE"
    );
    return res.status(200).send({
      //retorna um objeto vazio
    });
  }
  next();
});
app.use(helmet());

//routes
app.use("/api/v1/", v1MeasureRouter);
app.use("/api/v1/roles", v1RoleRouter);
app.use("/api/v1/users", v1UserRouter);

//quando não encontrar rota, entra aqui
app.use((req, res, next) => {
  const err = new NotFoundError();
  next(err);
});

// handle error, print stacktrace
app.use(errorHandler);

export default app;
