const users = [];


const addUser = ({ id, username, room }) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'username and room are required!'
        }
    }

    const existingUser = users
        .find(user => user.username === username && user.room === room);

    if (existingUser) {
        return {
            error: 'user already exist with this username in this room!'
        }
    }

    const newUser = {
        id,
        username,
        room
    }
    users.push(newUser);
    return { user: newUser };
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUserInRoom = (room) => {
    return users.filter(user => user.room === room.trim().toLowerCase());
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}