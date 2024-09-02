require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');

const authRouter = require('./route/authRoute');

const app = express();

const PORT = process.env.APP_PORT || 4000;

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'REST APIs are working',
    });
});

// all routes
app.use('/api/v1/auth', authRouter);
app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'failure',
        message: 'Route not found',
    });
});


app.listen(PORT, () => {
    console.log('Server is up and running on port: ', PORT);
});
