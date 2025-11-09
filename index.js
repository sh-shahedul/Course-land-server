 const express = require('express')
 const cors = require('cors');
 const { MongoClient, ServerApiVersion } = require('mongodb');
 require('dotenv').config()
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbmojlp.mongodb.net/?appName=Cluster0`;
 const app = express()
 const port = process.env.PORT ||3000

// middleWare 
app.use(cors())
app.use(express.json())
//CqRB8GGgLxRBj8EW    learningDB



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();

      const db = client.db('learningDB');
    const learningCOllection = db.collection('courses');





    // course api 
    app.get('/course',async(req,res)=>{
        const cursor = learningCOllection.find();
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/featuresCourse',async(req,res)=>{
        const cursor = learningCOllection.find({ isFeatured: true }).limit(6);
        const result = await cursor.toArray()
        res.send(result)
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('lerning platform running on')
})
app.listen(port, () => {
  console.log(`lerning platform running on ${port}`)
})