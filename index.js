const express=require('express');
const cors= require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app= express();
const port= process.env.PORT||2000

//middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlc70ez.mongodb.net/?retryWrites=true&w=majority`;

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
    const studentCollecton=client.db('StudentDb').collection('Students')

    app.post('/student',async(req,res)=>{
        const newStudent=req.body;
        console.log(newStudent,'hi')
        const result=await studentCollecton.insertOne(newStudent);
        
        console.log(result);
        res.send(result)
    })

    app.get('/student',async(req,res)=>{
        const cursor=studentCollecton.find();
        const result=await cursor.toArray();
        res.send(result);
    })

    app.get('/student/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await studentCollecton.findOne(query);
      res.send(result)
    })

    app.put('/student/:id',async(req,res)=>{
      const id=req.params.id;
      const student=req.body;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const updatedStudent={
        $set: {
          name: student.name,
          quantity: student.id,
          supplier: student.department,
          taste: student.skill,
          category: student.academic,
          details: student.details,
          photo: student.photo,
        },};
        const result=await studentCollecton.updateOne(filter,updatedStudent,options);
        res.send(result)
    })

    app.delete('/student/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await studentCollecton.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Student database is on')
})

app.listen(port,()=>{
    console.log(`Student database is running on PORT:${port}` )
})