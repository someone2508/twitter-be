const express = require('express');
const app = express();
require('dotenv').config();

const {mongodb} = require('./src/utils/lib/index');

mongodb.initialise();

app.use(express.json());

const authRoutes = require('./src/routes/auth');
const tweetRoutes = require('./src/routes/tweet');

app.use(authRoutes);
app.use(tweetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
});