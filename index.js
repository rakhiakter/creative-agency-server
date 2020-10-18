const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const  ObjectId  = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");
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
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));




client.connect((err) => {
  const services = client.db(process.env.DB_NAME).collection("services");
  const reviews = client.db(process.env.DB_NAME).collection("review");
  const orders = client.db(process.env.DB_NAME).collection("orders");
  const makeAdmin = client.db(process.env.DB_NAME).collection("admin");
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

app.post('/addReviews', (req, res) => {
    const feedback = req.body
    reviews.insertOne(feedback)
    .then(result => {
 res.send(result.insertedCount > 0);      
        })
})

 
// add order
 app.get("/getOrder", (req, res) => {
 orders.find({})
   .toArray((err, documents) => {
     res.send(documents);
   });
 }); 






app.get("/getOrder/:email", (req, res) => {
const email = req.params.email;
console.log({email});
  orders.find({ email: email })
  .toArray((err, documents) => {
      console.log(documents);
    res.send(documents);
  });
});


app.post('/addOrder', (req, res) => {
    console.log(req.body);
    console.log(req.files);
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const project = req.body.project;
        const detail = req.body.detail;
        const price = req.body.price;
        const newImg = file.data;
        const orderStatus = req.body.orderStatus;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        orders.insertOne({ name, email, image, project, detail, price, orderStatus })
            .then(result => {
                console.log("added to server");
                res.send(result.insertedCount > 0);
            })
    })

   

    app.post("/addService", (req, res) => {
      
      const file = req.files.file;
     
      
      const title = req.body.title;
      const paragraph= req.body.paragraph;
      const newImg = file.data;
       const encImg = newImg.toString("base64");

      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, "base64"),
      };

      services
        .insertOne({  image, title, paragraph })
        .then((result) => {
          console.log("added to server");
          res.send(result.insertedCount > 0);
        });
    });


app.post('/makeAdmin', (req, res) =>{
    console.log('makeAdmin');
    const email = req.body.email;
    makeAdmin.insertOne({ email })
    .then(result => {
        res.send(result.insertedCount > 0);
    })
})

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    makeAdmin.find({ email: email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });

})



  app.listen(port)