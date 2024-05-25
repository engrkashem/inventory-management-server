import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app: Application = express();

/*** parsers(middlewares) ***/
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', '*'], credentials: true }));
app.use(cookieParser());

/*** application routes ***/
app.use('/api/v2', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Inventory Management Server is Running');
});

/*** Global error handling middleware ***/
app.use(globalErrorHandler);

/*** Not found route handling middleware ***/
app.use(notFound);

export default app;
