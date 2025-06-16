import centralErrorHandler from './middlewares/centralErrors.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import https from 'https'; 
import fs from 'fs';      
import logger from './config/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import connectDB from './config/database.js';
import authRouter from './routes/auth.js';
import morganMiddleware from './middlewares/morgan.js';
import cookieParser from 'cookie-parser';
import { ErrorWithStatus } from './models/Errors.js';

const app: Express = express();
const port = process.env.PORT || 8443;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(morganMiddleware);
app.use(cookieParser());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorWithStatus({ message: 'Not Found', status: 404 });
  next(err);
});
app.use(centralErrorHandler);

try {
  const privateKey = fs.readFileSync('/etc/ssl/certs/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/certs/fullchain.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => {
    logger.info(`helloworld https port ${port}`); 
  });
} catch (err) {
  app.listen(port, () => {
    logger.error(`Failed to start HTTPS server: ${err}`);
    logger.info(`Falling back to HTTP on port ${port}`);
  }
  )}