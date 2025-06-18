import centralErrorHandler from "./middlewares/centralErrors.js";
import express, { Express, Request, Response, NextFunction } from "express";
import https from "https";
import fs from "fs";
import logger from "./config/logger.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import morganMiddleware from "./middlewares/morgan.js";
import cookieParser from "cookie-parser";
import { ErrorWithStatus } from "./models/Errors.js";
import { trackMiddleware } from "./middlewares/track.js";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import playerRouter from "./routes/player.router.js";
import teamRouter from "./routes/team.router.js";
import memberRouter from "./routes/member.router.js";
import adminRouter from "./routes/admin.router.js";
const app: Express = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
app.use(morganMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(trackMiddleware);

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/players", playerRouter);
app.use("/api/teams", teamRouter);
app.use("/api/members", memberRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorWithStatus({ message: "Not Found", status: 404 });
  next(err);
});

app.use(centralErrorHandler);

try {
  const privateKey = fs.readFileSync("/etc/ssl/certs/privkey.pem", "utf8");
  const certificate = fs.readFileSync("/etc/ssl/certs/fullchain.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, () => {
    logger.info(`Server listening on HTTPS port ${port}`);
  });
} catch (err) {
  logger.error("Failed to start HTTPS server:", err);
  app.listen(port, () => {
    logger.info(`Falling back to HTTP on port ${port}`);
  });
}
