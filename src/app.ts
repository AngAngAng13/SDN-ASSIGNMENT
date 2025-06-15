import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js'
import connectDB from './config/database.js';
import logger from './config/logger.js';
import morganMiddleware from './middlewares/morgan.js';
const app: Express = express();
const port = process.env.PORT 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
app.use(morganMiddleware);
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  const statusCode = res.statusCode;
  logger.error(
    `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

app.listen(port, () => {
  console.log(`Server is amoging running at http://localhost:${port}`);
});