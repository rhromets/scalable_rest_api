const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if (!['1', '2'].includes(body.userType)) {
        throw new AppError('Invalid user Type', 400);
    }

    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
        return next(new AppError('Failed to create the user', 400))
    }

    const result = newUser.toJSON()

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id,
    });

    return res.status(201).json({
        status: 'success',
        data: result
    });
});

const login = catchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const result = await user.findOne({ where: { email } });

        if (!result) {
            return next(new AppError('Incorrect email or password', 401));
        }

        const isPasswordMached = await bcrypt.compare(password, result.password);

        if (!isPasswordMached) {
            return res.status(401).json({
                status: 'failure',
                message: 'Incorrect email or password'
            });
        }

        const token = generateToken({
            id: result.id,
        });

        return res.json({
            status: 'success',
            token
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failure',
            message: 'Server error',
            error: err.message
        });
    }
    _
});

module.exports = { signup, login };