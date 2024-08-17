const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URI,{
        // useNewUrlParser: true, 
        // useUnifiedTopology: true,
    }).then(() => console.log("Database connected Successfully"))
    .catch((error) => {
        console.log("Database connected Failurefully")
        console.log(error)
        process.exit(1);
})
}