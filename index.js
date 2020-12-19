const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qsyrk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5001;

app.get('/', (req, res) =>{
    res.send("Okay");
    
})


const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect(err => {
  const dataCollection = client.db("creative_agency").collection("userData");


  app.post ('/userData' ,  (req, res) => {
      const userData = req.body;
      console.log(userData);
      dataCollection.insertOne(userData)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
      
  })
 
});


app.listen(process.env.PORT || port)