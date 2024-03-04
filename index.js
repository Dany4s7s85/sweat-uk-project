const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const ModuleRoutes = require('./Routes/ModuleRoutes');

//Express Server Setup
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Connection URL
const liveDb = process.env.MongoDB_URI;
const localDb = 'mongodb://localhost:27017/sweat'
mongoose.connect(liveDb)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        //Routes
        app.use('/module', ModuleRoutes);

        if (process.env.NODE_ENV == 'production') {
            app.use(express.static('client/build'));
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
            })
        }

        app.listen(port, () => {
            console.log(`Node/Express Server is Up......\nPort: localhost:${port}`);
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));