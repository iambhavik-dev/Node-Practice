const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user.model');


const auth = (req, res, next) => {
    try {
        const authToken = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jsonwebtoken.verify(authToken, 'adsfafl4a65d4d65a46a');
        User.findOne({ 'tokens.token': authToken, '_id': decoded.id })
            .then((user) => {
                if (!user) {
                    res.status(404).send('User not found');
                }
                req.token = authToken;
                req.u_id = decoded.id;
                next();
            })
            .catch(err => {
                res.status(500).send('Internal server error');
            })
    }
    catch (ex) {
        res.status(401).send('User unauthorized.');
    }
}

module.exports = auth;