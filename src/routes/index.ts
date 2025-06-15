import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Express with TypeScript' });
});
router.get('/register', (req: Request, res: Response) => {
  res.render('register', { title: 'Register' });
});
router.get('/login', (req: Request, res: Response) => {
  res.render('login', { title: 'Login' });
});

export default router;