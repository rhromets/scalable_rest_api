const user = require('../db/models/user');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const signup = async (req, res, next) => {
    try {
        const body = req.body;

        if (!['1', '2'].includes(body.userType)) {
            return res.status(400).json({
                status: 'failure',
                message: 'Invalid user Type',
            });
        }

        const newUser = await user.create({
            userType: body.userType,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            confirmPassword: body.confirmPassword,
        });

        const result = newUser.toJSON()

        delete result.password;
        delete result.deletedAt;

        result.token = generateToken({
            id: result.id,
        });

        if (!result) {
            return res.status(400).json({
                status: 'failure',
                message: 'Failed to create the user'
            });
        }

        return res.status(201).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failure',
            message: 'Server error',
            error: err.message
        });
    }

}

module.exports = { signup };