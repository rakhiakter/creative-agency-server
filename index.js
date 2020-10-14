const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const  ObjectId  = require("mongodb").ObjectId;
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nimyg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express(); 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




client.connect((err) => {
  const services = client.db(process.env.DB_NAME).collection("services");
  const reviews = client.db(process.env.DB_NAME).collection("review");
console.log("hello");

app.get("/getService", (req, res) => {
  services.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.get("/getReviews", (req, res) => {
  reviews.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});


})



  app.listen(port)