const express = require('express');
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const productCollection=client.db('toyDB').collection('products');
    const checkOutCollection=client.db('toyDB').collection('checkouts');

    // checkOut product collection

    app.get('/checkouts', async(req, res)=>{
      let query={};
      if(req.query?.email){
        query={email: req.query.email}
      }
      const result= await checkOutCollection.find().toArray();
      res.send(result)
    })

    app.post('/checkouts', async(req, res)=>{
      const checkOut=req.body;
      const result=await checkOutCollection.insertOne(checkOut);
      res.send(result)
    })

    app.patch('/checkouts/:id', async(req, res)=>{
      const updateBooking=req.body;
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          status: updateBooking.status
        },
      };
     const result= await checkOutCollection.updateOne(filter, updateDoc);
     res.send(result)
    })

    app.delete('/checkouts/:id', async(req, res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result= await checkOutCollection.deleteOne(query);
      res.send(result)
    })

// All Products Collection
    app.get('/products', async(req,res)=>{
      const cursor=productCollection.find();
      const result= await cursor.toArray();
      res.send(result)
    })

    app.get('/products/:id', async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await productCollection.findOne(query);
      res.send(result)
    } )
// my Toys Collection
    app.get('/toys', async(req, res)=>{
        const cursor=toyCollection.find();
        const result=await cursor.toArray();
        res.send(result)
    })

    app.get('/toys/:id', async(req, res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const options = {
        // Include only the `title` and `imdb` fields in each returned document
        projection: { title: 1, categoryId: 1 ,price: 1, photo:1, toyName:1, quantity:1 , detail: 1, toyName: 1, categoryId: 1},
      };
      const result= await toyCollection.findOne(query, options);
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