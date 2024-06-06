const databaseClient = require("mongoose");
const dbName = "BO_DB";

async function connect(dbname) {
  try {
    await databaseClient.connect(dbname, {});
    console.log("Connect to MongoDB successfully!");
  } catch (err) {
    console.log(`Error connecting to Mongo`);
  }
}

module.exports = {
  connect: connect,
};
