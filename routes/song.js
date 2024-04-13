const express = require('express');
const { Song } = require('../models/songs');
const songRouter = express.Router();

songRouter.get('/api/get-songs', async (req, res) => {
    try {
        const songs = await Song.find({});
        res.json({ success: true, data: songs, message: 'Successfully Loaded songs' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

module.exports = songRouter;