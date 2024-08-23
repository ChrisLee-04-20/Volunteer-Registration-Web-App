const { MongoClient, ObjectId } = require('mongodb');

//Created the .env file with the dotenv and declared the DB_URL in the .env
process.env.MONGODB_URI = 'mongodb://comp3047-assignment1:Q474nXRLZdJac0SNzkg7dwaSG2xWtWpUgWRCOvmjObg2vPGCUDohzWHrR2VIEFK4yMHObFSXHfXdACDb6ehNPQ==@comp3047-assignment1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@comp3047-assignment1@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    // console.log("DEBUG: connecting url: " + process.env.MONGODB_URI);
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
    const db = client.db('ngoDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };