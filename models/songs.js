const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true,
    },
    artistName : {
        type: String,
        required: true,
        trim: true,
    },
    musicImage : {
        type: String,
        required: true,
        trim: true,
    },
    isFavourite : {
        type: Number,
        default: 0,
    },
    musicUrl : {
        type: String,
        required: true,
    },
    
});

const Song = mongoose.model('Song', songSchema);
module.exports = {Song , songSchema};