require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

//db connection
const dbConnect = require('./db/dbConnect');
//error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(bodyParser.json());

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;
const start = async(req, res) => {
    try {
        await dbConnect(process.env.MONGO_URL)
        app.listen(() => {
            console.log(`App is starting on port ${port}...`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();
