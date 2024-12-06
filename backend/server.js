const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser')
const cors = require('cors')

// Connection URL
const url = process.env.MONGO_URI;

if (!url) {
  throw new Error("MONGO_URI not found in .env file"); // This will help if the URI is missing
}
const client = new MongoClient(url);


// database Name


const dbName = "passManage";
const app = express();
const port = 8080;

app.use(bodyParser.json())
app.use(cors())


client.connect().then(()=>{
  console.log(`connected to mongoDb, you can check it on port :${port}`);
  
})
 
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("documents")
    const findResult = await collection.find({}).toArray()
    res.json(findResult)

  } catch (error) {
     res.status(500).send({error:"Check get request"}) 
  }
});



app.post('/', async (req,res) =>{
   try {
    const db = client.db(dbName)
    const collection = db.collection("documents")
    const password = req.body.password

    if(!password) {
       return res.status(400).send({success:false, message :" no password provided"})
      
    }

    const insertResult = await collection.insertOne({password})
   res.status(200).send({success: true ,  result :insertResult})

   } catch (error) {
      res.status(500).send({error: "an error occured at your Post Request"})    
   }

})

// Delete Password



app.delete('/', async (req,res) =>{
 try {
  
  const db = client.db(dbName)
  const collection = db.collection('documents')
  const password = req.body.password
 
  if(!password) {
    return res.status(400).send({success:false, message:"no password provided"})

  }

  const deleteResult = await collection.deleteOne({password})

  res.send({success:true, result: deleteResult})
 } catch (error) {
  res.status(500).send({error:"error occured in delete request"})
  
 }
})

app.listen(port, (err) => {
  console.log(`Your Server is Running on port : ${port}`);
});
