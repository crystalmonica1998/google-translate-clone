import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@google-translate-clone1243.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if(!connectionString) {
    throw new Error('Please define the username and password')
}

const connectDB = async () => {
    if(mongoose.connection?.readyState >= 1) {
        console.log('---- Already connected to MongoDB ----');
        return;
    }

    try {
        await mongoose.connect(connectionString);
        console.log('---- Connected to MongoDB ----')
    } catch(error: any) {
        console.error('Could not connect to MongoDB: ', error);
    }
}

export default connectDB