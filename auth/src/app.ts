import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@cgestione/fl-common';
import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';
const app = express();


//Edit these settings when you have a proper ssl certificate
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,
}));

//middlewares
app.use(currentUser);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
//routes

//Handling asynchronous errors
app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };