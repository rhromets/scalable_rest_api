const user = require('../db/models/user');
const signup = async (req, res, next) => {
    try {
        const body = req.body;

        if (!['1', '2'].includes(body.userType)) {
            return res.status(400).json({
                status: 'failure',
                message: 'Invalid user Type'
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

        if (!newUser) {
            return res.status(400).json({
                status: 'failure',
                message: 'Failed to create the user'
            });
        }

        return res.status(201).json({
            status: 'success',
            data: newUser
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