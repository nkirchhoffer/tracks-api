require('dotenv').config();

const express    = require('express');
const http       = require('http');
const app        = express();
const server     = http.createServer(app);
const { Server } = require('socket.io');
const io         = new Server(server);
const cors       = require('cors');

const search  = require('./routes/search');
const player  = require('./routes/player');
const utils   = require('./utils');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/search', search);
app.use('/player', player);

io.on('connection', socket => {
    console.log('utilisateur connecté !');
});

setInterval(() => {
    utils.getPlayback().then(playback => {
        console.log('titre du playback : ' + playback.item.name);
        io.emit('playback', playback);
    });
}, 2000);

server.listen(process.env.PORT, () => {
    console.log(`Écoute sur le port ${process.env.PORT}`);
});