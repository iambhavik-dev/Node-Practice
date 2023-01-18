const socketIO = io();

//  Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("#btn-submit");
const $messages = document.querySelector("#messages");

//  Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const roomTemplate = document.querySelector('#room-template').innerHTML;


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


const autoScroll = () => {
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

// receive messages
socketIO.on('message', (message) => {

    const element = Mustache.render(messageTemplate, {
        message: message.message,
        username: message.username,
        createdAt: moment(message.time).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', element);
    autoScroll();
});

// receive locations
socketIO.on('locationMessage', (message) => {

    const element = Mustache.render(locationTemplate, {
        url: message.url,
        username: message.username,
        createdAt: moment(message.time).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', element);
    autoScroll();
});

// received room details
socketIO.on('roomData', ({ room, users }) => {

    const element = Mustache.render(roomTemplate, {
        room,
        users
    });
    document.querySelector('#slidebar').innerHTML = element;
    autoScroll();
});


$messageForm
    .addEventListener('submit', (e) => {
        e.preventDefault();

        $messageFormButton.setAttribute('disabled', 'disabled');

        const message = e.target.elements.message.value;

        socketIO.emit('sendMessage', message, (err) => {

            $messageFormButton.removeAttribute('disabled');
            $messageFormInput.value = '';
            $messageFormInput.focus();

            if (err) {
                return console.error(err);
            }

            console.log('Message delivered');
        });
    });


document.querySelector("#send-location")
    .addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                const { latitude, longitude } = position.coords

                // send location to server
                socketIO.emit('sendLocation', `${latitude},${longitude}`, () => {
                    console.log('Location shared.');
                })

            })
        }
        else {
            alert('Browser not support this feature');
        }
    });

socketIO.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
})