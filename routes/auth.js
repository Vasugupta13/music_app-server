
const express = require('express'); 
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken'); 
const {Song} = require('../models/songs');
const UserSong = require('../models/user-song');

authRouter.post('/api/auth/signup',async (req, res) => {
   try{
      const { name, email, password, type } = req.body;
      const existingUser = await User.findOne({email});
      if(existingUser){
         return res.status(400).json({success: false, message: 'User already exists'});
      }
     const hashPassword = await bcryptjs.hash(password, 8);
      let user = new User ({
         name,
         email,
         password: hashPassword,
         type,
      });
      let songs = await Song.find({});
      let userSongs = new UserSong({
         userId: user._id,
         songList: songs.map(song => ({song})),
      });
      user = await user.save();
      userSongs = await userSongs.save();
      res.json({success: true,message: 'Sign-up Successfull! You can now login!'});

   }catch(err){
      res.status(500).json({success: false, message: err.message});
   }
  
});

//Signin Route

authRouter.post('/api/auth/login', async (req, res) => {
   try{
      const { email, password } = req.body;
      const user = await User.findOne({email});
      
      if(!user){
         return res.status(400).json({success:false, message: 'User does not exist'});
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if(!isMatch){
         return res.status(400).json({success:false, message: 'Invalid credentials'});
      }
     const token = jwt.sign({id: user._id}, "passwordKey");
     let userSongs = await UserSong.findOne({ userId: user._id,});
     res.json({success: true,token:token,data:userSongs,user: user._doc,message: 'Successfully logged in'});
   }catch(err){
      res.status(500).json({error: err.message});
   }
});


module.exports = authRouter;