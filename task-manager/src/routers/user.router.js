const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../middleware/auth');
const User = require('../models/user.model');

const router = new express.Router();



// Login user
router.post('/login', async (req, res) => {
    var response = await User.authenticate(req.body.email, req.body.password);
    if (response.status == 404) {
        res.status(response.status).send({ message: "User not found." });
    }
    else if (response.status == 401) {
        res.status(response.status).send({ message: "Invalid credentials." });
    }
    else {
        await response.user.generateToken();
        res.status(response.status).send({ message: "Success.", response });
    }
});



// Logout user
router.post('/logout', auth, async (req, res) => {
    User.findOne({ 'tokens.token': req.token, '_id': req.u_id })
        .then(user => {
            user.tokens = user.tokens.filter(token => token.token != req.token);
            user.save()
                .then(() => res.send({ message: 'User loggedOut.' }))
                .catch(e => {
                    res.status(400).send({
                        message: 'Failed to loggedOut.',
                        err: JSON.stringify(e)
                    })
                })
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal server error',
                err: JSON.stringify(err)
            })
        })
});



// Logout all sessions
router.post('/logoutAll', auth, async (req, res) => {
    User.findOne({ 'tokens.token': req.token, '_id': req.u_id })
        .then(user => {
            user.tokens = [];
            user.save()
                .then(() => res.send({ message: 'LoggedOut from all sessions.' }))
                .catch(e => {
                    res.status(400).send({
                        message: 'Failed to loggedOut.',
                        err: JSON.stringify(e)
                    })
                })
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal server error',
                err: JSON.stringify(err)
            })
        })
});









// Get list of users
router.get('/', auth, (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch(err => res.status(500).send(err));
});


// Get user by Id
router.get('/:id', auth, (req, res) => {
    var id = req.params.id;

    User.findById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).send()
            }
            res.status(200).send(user);
        })
        .catch(err => res.status(500).send(err));
});


// Add new user
router.post('/', async (req, res) => {
    var user = new User(req.body);
    await user.generateToken();
    user.save()
        .then((dbResponse) => res.send(dbResponse))
        .catch(err => res.status(400).send(err));
});


// Update existing user
router.patch('/:id', auth, (req, res) => {

    // validate payload
    var payload = Object.keys(req.body);
    var validKeys = ["name", "age", "email", "password"];
    if (!payload.every(x => validKeys.includes(x))) {
        return res.status(400).send('Invalid request body');
    }

    User.findById(req.params.id)
        .then((user) => {

            if (!user) {
                return res.send(404).send("No user found!")
            }

            payload.forEach(value => {
                user[value] = req.body[value]
            });

            user.save()
                .then((user) => {
                    res.status(200).send(user);
                })
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});

// Remove user
router.delete('/:id', auth, (req, res) => {

    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send()
            }
            res.status(200).send(user);
        })
        .catch(err => res.status(500).send(err));
});




/**
 * Avatar apis
 */

const uploader = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1024 * 1000
    },
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(undefined, true)
        }
        else {
            return callback(new Error("Only jpeg, jpg and png are allowed to upload."))
        }
    }
})

// Add new avatar for user
router.post('/me/avatar', auth, uploader.single('avatar'), (req, res) => {
    User.findOne({ 'tokens.token': req.token, '_id': req.u_id })
        .then(async user => {

            const buffer = await sharp(req.file.buffer)
                .resize({ width: 250, height: 250 })
                .png()
                .toBuffer();

            user.avatar = buffer
            user.save()
                .then((user) => {
                    res.status(200).send(user);
                })
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
}, (err, req, res, next) => {
    res.status(400).send({ 'error': err.message });
});


// Get user avatar by id
router.get('/:id/avatar', (req, res) => {
    User.findById(req.params.id)
        .then(user => {

            if (!user || !user.avatar) {
                return res.status(400).send();
            }

            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
        })
        .catch(err => res.status(500).send(err));
});


// Delete avatar from user 
router.delete('/me/avatar', auth, (req, res) => {
    User.findOne({ 'tokens.token': req.token, '_id': req.u_id })
        .then(user => {
            user.avatar = undefined
            user.save()
                .then((user) => {
                    res.status(200).send();
                })
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});




module.exports = router;