import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Database Connected");
    } catch (error) {
        console.log("DB Error: " + error);
        process.exit(1);
    }
};

export default dbConnection;
