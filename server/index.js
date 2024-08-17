const express = require('express')
const app = express();

//routes
const user = require('./routes/userRoutes');
const profile = require('./routes/profileRoutes');
const payment = require('./routes/paymentRoutes');
const course = require('./routes/courseRoutes');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudinaryConnect } = require('./config/cloudinary')
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv')

dotenv.config();
const PORT = process.env.PORT || 4000;  

//database
database.connect();
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

//file upload
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
//connect to cloudinary server
cloudinaryConnect();

//routes
app.use('/api/v1/auth', user);
app.use('/api/v1/profile', profile);
app.use('/api/v1/course', course);
app.use('/api/v1/payment', payment);
//app.use("/api/v1/reach", contactUsRoute);

//default routes
app.get('/', (req, res) => {
    return res.json({
        success : true,
        message: "Server is up and running"
    })
});

app.listen(PORT, () => {
    console.log(` App listening on ${PORT}`);
});