const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qsyrk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5001;

app.get('/', (req, res) =>{
    res.send("Okay");
    
})


const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect(err => {
  const dataCollection = client.db("creative_agency").collection("userData");
  const courseDataCollection = client.db("creative_agency").collection("course");
  const UserLogInDataCollection = client.db("creative_agency").collection("login");



  app.post ('/userData' ,  (req, res) => {
      const userData = req.body;
      console.log(userData);
      dataCollection.insertOne(userData)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
      
  })
  app.post ('/userLogin' ,  (req, res) => {
    const userLogInData = req.body;
    console.log(userLogInData);
    UserLogInDataCollection.insertOne(userLogInData)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
    
})

  app.get ('/findUserByMail' ,  (req, res) => {
    const mail = req.body;
    console.log(mail);
    
    dataCollection.find()

    .toArray((err, documents) => {
        res.status(200).send(documents);
    })

})


app.post ('/addCourse' ,  (req, res) => {
    const files = req.files.file;
    const pass = req.body.pass;
    const email = req.body.email;
    console.log(files, pass, email);

    files.mv(`${__dirname}/course/${files.name}`, error => {
    if(error){
    console.log(error);
    return res.status(5001).send({meg:"Failed to load image"})
}
    })
    const newImg = req.files.file.data;
    const enCodedImg = newImg.toString('base64');
    
    const image ={
        contentType: req.files.file.mimetype,
        size: req.files.file.size,
        img:Buffer.from(enCodedImg, 'base64')
    };
    courseDataCollection.insertOne({image, pass, email})
    .then(results => {
        res.send(results.insertedCount > 0)
    }) 
   
});






app.get('/newCourses', (req, res) => {
    courseDataCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});
 
});


app.listen(process.env.PORT || port)