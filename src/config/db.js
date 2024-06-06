const databaseClient = require("mongoose");
const dbName = "BO_DB";

async function connect() {
  try {
    await databaseClient.connect(`mongodb+srv://huydq23itb:OZ959l8m1ORJbiPe@trademark.qbrpwak.mongodb.net/`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connect to MongoDB successfully!");
    
  } catch (err) {
    console.log(`Error connecting to Mongo`);
  }
}

module.exports = {
  connect: connect,
};
