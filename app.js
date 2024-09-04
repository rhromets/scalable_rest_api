require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');

const authRouter = require('./route/authRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const { stack } = require('sequelize/lib/utils');
const globalErrorHandler = require('./controller/errorController');

const app = express();

const PORT = process.env.APP_PORT || 4000;

app.use(express.json());

// all routes
app.use('/api/v1/auth', authRouter);

app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log('Server is up and running on port: ', PORT);
});
