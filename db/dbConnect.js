const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() =>{
      console.log("db connection succesful")
  }).catch((error) => {
    console.log(error)
  });
}

module.exports = connectDB