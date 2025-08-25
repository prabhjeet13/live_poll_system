const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('database connected'))
    .catch((error) => console.log('db not connected')); 
}