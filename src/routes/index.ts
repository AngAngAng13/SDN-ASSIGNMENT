import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Express with TypeScript' });
});

export default router;