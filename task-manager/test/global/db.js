const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../../src/models/user.model');

const defaultUserId = new mongoose.Types.ObjectId();
const defaultUser = {
    _id: defaultUserId,
    name: 'dev',
    email: 'dev@gmail.com',
    password: 'dev@123',
    tokens: [{
        token: jsonwebtoken.sign({ id: defaultUserId }, 'adsfafl4a65d4d65a46a')
    }]
}

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(defaultUser).save();
}

module.exports = {
    defaultUser,
    defaultUserId,
    setupDatabase
}
