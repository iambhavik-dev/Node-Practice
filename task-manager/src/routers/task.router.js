const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();

const Task = require('../models/task.model');
const User = require('../models/user.model');

// Get list of tasks
router.get('/', auth, (req, res) => {
    Task.find({})
        .then((tasks) => res.send(tasks))
        .catch(err => res.status(500).send(err));
});


// GET: users/me
// GET: users/me?completed=true
// GET: users/me?limit=2&skip=0
router.get('/me', auth, (req, res) => {

    var match = {}, sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        sort.createdAt = req.query.sortBy === 'desc' ? -1 : 1
    }

    User.findById(req.u_id)
        .then(async (user) => {
            await user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
            res.send(user.tasks)
        })
        .catch(err => res.status(500).send(err));
});


// Get task by id
router.get('/:id', auth, (req, res) => {
    var id = req.params.id;

    Task.find({ _id: id, userId: req.u_id })
        .then((task) => {
            if (!task) {
                return res.status(404).send();
            }
            res.status(200).send(task);
        })
        .catch(err => res.status(500).send(err));
});



// Add new task
router.post("/", auth, (req, res) => {
    const task = new Task({
        ...req.body,
        userId: req.u_id
    });
    task.save()
        .then((dbResponse) => res.send(dbResponse))
        .catch(err => res.status(400).send(err));
});


// Update existing task
router.patch("/:id", auth, (req, res) => {

    // validate payload
    var payload = Object.keys(req.body);
    var validKeys = ["description", "completed"];
    if (!payload.every(x => validKeys.includes(x))) {
        return res.status(400).send('Invalid request body');
    }

    Task.findByIdAndUpdate(req.params.id, req.body)
        .then((task) => {
            if (!task) {
                return res.status(404).send()
            }
            res.status(200).send(task);
        })
        .catch(err => res.status(500).send(err));
});


// Remove task
router.delete('/:id', auth, (req, res) => {

    Task.findByIdAndDelete(req.params.id)
        .then((task) => {
            if (!task) {
                return res.status(404).send()
            }
            res.status(200).send(task);
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;