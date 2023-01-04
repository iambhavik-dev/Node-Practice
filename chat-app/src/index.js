const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require('./utils/messages')

const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/user')

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const PORT = process.env.PORT || 3000;
const publicFolderPath = path.join(__dirname, '../public');

app.use(express.static(publicFolderPath));

io.on('connection', (socket) => {
    console.log('connected to web socket');

    socket.on('join', (options, callback) => {

        // create room 
        socket.join(options.room)
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error)
        }

        socket.emit('message', generateMessage('Admin', 'Welcome!!'));
        socket.broadcast.to(options.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.emit('message', generateMessage('Admin', `${user.username} has left..`));
        }

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity not allowed.')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback()
    });

    // on location received
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps/@${location}`));
        callback();
    });





});




httpServer.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
});