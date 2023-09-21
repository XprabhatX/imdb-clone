import mongoose from "mongoose";

const dbConnect = () => {
    const connectionParams = { useNewUrlParser: true };
    mongoose.connect(process.env.DB, connectionParams);

    mongoose.connection.on("connected", () => {
        console.log("🍃 ✔ connected to database");
    });

    mongoose.connection.on("error", (err) => {
        console.log("❌❌❌ error while connecting to db: " + err);
    })

    mongoose.connection.on("disconnected", () => {
        console.log("🍃 ❌ disconnected from database");
    })
}

export default dbConnect;