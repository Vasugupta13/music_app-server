const mongoose = require('mongoose');
const { songSchema }  = require('./songs');
const userSongSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    songList: [{
        song: songSchema,
      }],
});

const UserSong = mongoose.model('UserSong', userSongSchema);
module.exports = UserSong;