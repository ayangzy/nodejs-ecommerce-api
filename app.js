require('dotenv').config();
require('express-async-errors');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//db connection
const dbConnect = require('./db/dbConnect');

//routers
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');

//error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true }));

app.get("/hello", (req, res) => {
    res.status(200).send("<p>Hello you hit me</p>")
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;
const start = async(req, res) => {
    try {
        await dbConnect(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`App is starting on port ${port}...`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();

module.exports = app;
