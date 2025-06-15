import centralErrorHandler from './middlewares/centralErrors.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from './models/Errors.js';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js'
import connectDB from './config/database.js';
import authRouter from './routes/auth.js';
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
app.use('/auth', authRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorWithStatus({ message: 'Not Found', status: 404 });
  next(err);
});
app.use(centralErrorHandler);

app.listen(port, () => {
  console.log(`Server is amoging running at http://localhost:${port}`);
});