require('dotenv').config({ silent: true })
const express = require('express') 
const cors = require('cors') 
const mongoose = require('mongoose')

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

app.get("/hello", (req, res) => {
  res.json({ message: "server is working" });
});


module.exports = app