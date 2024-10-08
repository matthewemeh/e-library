const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const { connection } = mongoose;
connection.once('open', () => console.log('MongoDB database connection established successfully'));

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const emailRoutes = require('./routes/email');
const firebaseRoutes = require('./routes/firebase-file');

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/email', emailRoutes);
app.use('/firebase-file', firebaseRoutes);

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server is running on port: ${port}`));
