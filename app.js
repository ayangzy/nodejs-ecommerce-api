require('dotenv').config();
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

const start = async(req, res) => {
    try {
        app.listen(() => {
            console.log(`App is starting on port ${port}...`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();
