const express = require('express');
const UserSong = require('../models/user-song');
const auth = require('../middlewares/auth');
const { Song } = require('../models/songs');
const userSongRouter = express.Router();

userSongRouter.get('/api/user/get-song', auth, async (req, res) => {
    try {
        console.log(req.user);
        let userSongs = await UserSong.findOne({ userId: req.user,});
        res.json({ success: true, data: userSongs, message: 'Successfully Loaded user songs' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

userSongRouter.put('/api/user/update-favourite',auth,async (req, res) => {
    try {
        const { songId, isFavourite } = req.body;

        // Find the UserSong document and update the isFavourite field of the specific song
        const updatedUserSong = await UserSong.findOneAndUpdate(
            { userId: req.user, 'songList.song._id': songId },
            { $set: { 'songList.$.song.isFavourite': isFavourite } },
            { new: true }  // This option returns the updated document
        );

        if (!updatedUserSong) {
            return res.status(404).json({ success: false, message: 'User or song not found' });
        }

        res.json({ success: true, data: updatedUserSong, message: 'Successfully updated favourite status' });
    } catch (err) {
        console.error(err);  
        res.status(500).json({ success: false, message: 'Failed to update favourite status' });
    }
});

userSongRouter.put('/api/user/update-songs',auth, async (req, res) => {
    try {
        const { songList } = req.body;

        // Find the UserSong document and update it
        const updatedUserSong = await UserSong.findOneAndUpdate(
            { userId: req.user },
            { $set: { songList: songList } },
            { new: true }  // This option returns the updated document
        );

        if (!updatedUserSong) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: updatedUserSong, message: 'Successfully updated songs' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update songs' });
    }
});
userSongRouter.get('/api/user-songs/search/:query', auth, async (req, res) => {
    try {
        const userSongs = await UserSong.findOne({
            userId: req.user,
        });
    

        const matchedSongs = userSongs.songList.filter(song => 
            new RegExp(req.params.query, 'i').test(song.song.title) || 
            new RegExp(req.params.query, 'i').test(song.song.artistName)
        );

        res.json({ success: true, data: matchedSongs });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to search user songs' });
    }
});
module.exports = userSongRouter;