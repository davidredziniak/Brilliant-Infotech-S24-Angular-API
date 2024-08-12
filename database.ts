const mongoose = require('mongoose');

// Try to connect to the MongoDB cluster using connection string in .env
export async function connectToDatabase(connectionString:string) {
    mongoose.connect(connectionString);
    const database = mongoose.connection;

    // Connection error
    database.on('error', (error: any) => {
        console.log(error);
    })

    // Successful connection to DB
    database.once('connected', () => {
        console.log('Database Connected');
    })
}