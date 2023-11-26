const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aw2xu1p.mongodb.net/?retryWrites=true&w=majority`;

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
        
        const EmployeesCollection = client.db('AssetWise').collection('employeeInfo')
        const adminCollection = client.db('AssetWise').collection('adminInfo')
        const allUsersCollection = client.db('AssetWise').collection('allUsers')
        const packagesCollection = client.db('AssetWise').collection('packages')
        // const adminCollection = client.db('admin').collection('adminData')

        // employees info

        app.post('/employeesInfo',async(req,res)=>{
            const result = await EmployeesCollection.insertOne(req.body)
            res.send(result)
        })

        // admin info

        app.post('/adminInfo',async(req,res)=>{
            const result = await adminCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/adminInfo', async(req,res)=>{
            const result = await adminCollection.find().toArray()
            res.send(result)
        })

        // packages

        app.get('/packages', async(req,res)=>{
            const result = await packagesCollection.find().toArray()
            res.send(result)
        })

        app.get('/packages/:package',async(req,res)=>{
            const package = req.params.package
            const query = {name:package}
            const result = await packagesCollection.findOne(query)
            res.send(result)
        })

        app.post('/allUsers',async(req,res)=>{
            const result = await allUsersCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/allUsers',async(req,res)=>{
            const result = await allUsersCollection.find().toArray()
            res.send(result)
        })

        app.get('/allUsers/:email',async(req,res)=>{
            const email = req.params.email
            const query = {email:email}
            console.log(query);
            const result = await allUsersCollection.findOne(query)
            res.send(result)
        })
        // payment
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            console.log('amount in the payment', amount);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
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


app.get('/', (req, res) => {
    res.send('Project is running properly')
})

app.listen(port, () => {
    console.log(`Project is running properly on port ${port}`);
})
