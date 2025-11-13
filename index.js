 const express = require('express')
 const cors = require('cors');
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config()
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbmojlp.mongodb.net/?appName=Cluster0`;
 const app = express()
 const port = process.env.PORT ||3000

// middleWare 
app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // await client.connect();

      const db = client.db('learningDB');    
      const learningCOllection = db.collection('courses');
      const enrollCOllection = db.collection('enrolls');




    // course api ================

    // all course 

    app.get('/course',async(req,res)=>{
        const category = req.query.category
        const email = req.query.email
        const query ={}
        if(category){
            query.category=category
        }
        if(email){
          query.created_by = email
        }
        const cursor = learningCOllection.find(query).sort({created_at:'desc'});
        const result = await cursor.toArray()
        res.send(result)
    })


      //features course
    app.get('/featuresCourse',async(req,res)=>{
        const cursor = learningCOllection.find({ isFeatured: true }).sort({created_at:'desc'}).limit(6);
        const result = await cursor.toArray()
        res.send(result)
    })



    //   details each course
    app.get('/course/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await learningCOllection.findOne(query)
        res.send(result)
    })



    // add course 

    app.post('/course',async(req,res)=>{
        const newCourse = req.body;
        const result = await learningCOllection.insertOne(newCourse)
        res.send(result)
    })


    app.patch('/course/:id',async(req,res)=>{
      const id = req.params.id
      const updateCourse = req.body
      const query = {_id: new ObjectId(id)}
      const update ={
        $set: updateCourse
           
      }
      const result = await learningCOllection.updateOne(query,update)
      res.send(result)
      
    })

    app.delete('/course/:id',async(req,res)=>{
      // console.log('delete a user from database')
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await learningCOllection.deleteOne(query)
       res.send(result)
    })

    // eneoll api 
    app.post('/enrolled',async(req,res)=>{
             const data = req.body;
             const result = await enrollCOllection.insertOne(data)
             res.send(result)
    })

   app.get('/enrolled',async(req,res)=>{
    
        const email = req.query.email
        const query ={}
       
        if(email){
          query.enrolled_by = email
        }
        const cursor = enrollCOllection.find(query);
        const result = await cursor.toArray()
        res.send(result)
   })

    
    // await client.db("admin").command({ ping: 1 });
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