const mongoose = require("mongoose");

const MONGO_URL = 'mongodb+srv://vaseto27:lQOv7zERBsSHZnXJ@nasa.iqjpl24.mongodb.net/?retryWrites=true&w=majority';


mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});


async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

module.exports = {mongoConnect}