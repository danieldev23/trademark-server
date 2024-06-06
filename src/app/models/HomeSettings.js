const mongoose = require("mongoose");


const Home = new mongoose.Schema({
    webSetings: {
        websiteName: {
            type: String,
        }
    }
})


const HomeModel = mongoose.model('Home', Home);
export default HomeModel;
