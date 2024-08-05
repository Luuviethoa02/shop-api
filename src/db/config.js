const mongoose = require('mongoose');

async function connectdb(){
    const password = process.env.MONGODB_PASSWORD;
    const username = process.env.MONGODB_USERNAME;
    if (!password) {
        console.error('MongoDB password not found in environment variables');
        return;
    }
    const url =`mongodb+srv://${username}:${password}@admin.oldiwlm.mongodb.net/`;
    mongoose.connect(url)
    .then(()=>{
       console.log("DB connection successful.");
    })
    .catch((err)=>{
       console.log(`DB connection error:${err}`);
    });
}

module.exports = connectdb;