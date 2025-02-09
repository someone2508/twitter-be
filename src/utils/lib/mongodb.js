const mongoose = require('mongoose');

function MongoClient() {
    this.options = {}
}

MongoClient.prototype.initialise = function() {
    mongoose.connect(process.env.MONGO_URI, this.options)
    .then(() => console.log("MongoDB database connected!"))
    .catch((error) => {
        throw error;
    })
}

module.exports = new MongoClient();