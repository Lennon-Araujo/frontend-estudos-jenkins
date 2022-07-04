const express = require('express');
const cors = require('cors');
const axios = require('axios')
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8000;

server.listen(PORT)

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/login', (req, res) => {
//     res.render('login.html')
// })

app.get('/chat-api', async (req, res) => {
    try {
        const { data } = await axios('http://localhost:3000/users')
        console.log(data)
        return res.json(data);
    } catch (error) {
        console.error(error)
    }
})

let connectedUsers = [];

io.on('connection', (socket) => {
    console.log("Conexão detectada...");

    socket.on('join-request', (username) => {
        socket.username = username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);
        console.log(connectedUsers);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });

    });

    socket.on('send-msg', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        };
        socket.broadcast.emit('show-msg', obj);
    });

});