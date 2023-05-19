const express = require('express');
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;


// const categories=require('./data/categories.json');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TM_USER}:${process.env.TM_PASS}@cluster0.xj518fd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection=client.db('toyDB').collection('toy');
    const productCollection=client.db('toyDB').collection('products')

// All Products Collection
    app.get('/products', async(req,res)=>{
      const cursor=productCollection.find();
      const result= await cursor.toArray();
      res.send(result)
    })
// my Toys Collection
    app.get('/toys', async(req, res)=>{
        const cursor=toyCollection.find();
        const result=await cursor.toArray();
        res.send(result)
    })

    app.post('/toys', async(req, res)=>{
        const newToys=req.body;
        console.log(newToys);
        const result=await toyCollection.insertOne(newToys);
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('toy marketplace is running...')
})

app.listen(port, ()=>{
    console.log(`Toy Marketplace is running on port: ${port}`);
})