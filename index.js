const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = 3000;

//IMPORTS

const authRouter = require('./routes/auth');
const songRouter = require('./routes/song');
const userSongRouter = require('./routes/user-song');
//MIDDLEWARES

app.use(express.json()); 
app.use(authRouter);
app.use(songRouter);
app.use(userSongRouter);

mongoose.connect(process.env.DB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));