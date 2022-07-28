require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

//db connection
const dbConnect = require('./db/dbConnect');

//routers
const authRoutes = require('./routes/authRoute');

//error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(bodyParser.json());
app.get("/hello", (req, res) => {
    res.status(200).send("<p>Hello you hit me</p>")
});
app.use('/api/v1/auth', authRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;
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
