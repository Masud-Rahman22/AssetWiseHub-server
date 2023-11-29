const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000;

// middleware Here
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        
        const EmployeesCollection = client.db('AssetWise').collection('employeeInfo')
        const adminCollection = client.db('AssetWise').collection('adminInfo')
        const allUsersCollection = client.db('AssetWise').collection('allUsers')
        const packagesCollection = client.db('AssetWise').collection('packages')
        const paymentsCollection = client.db('AssetWise').collection('payments')
        const assetsInfoCollection = client.db('AssetWise').collection('assetsInfo')
        const requestForAssetCollection = client.db('AssetWise').collection('requestForAsset')
        const customRequestCollection = client.db('AssetWise').collection('customRequest')
        const teamCollection = client.db('AssetWise').collection('team')
        const userCollection = client.db('AssetWise').collection('user')
        // const adminCollection = client.db('admin').collection('adminData')

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            })
            res.send({ token });
        })

        // employees info

        app.post('/employeesInfo',async(req,res)=>{
            const result = await EmployeesCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/employeesInfo/:email',async(req,res)=>{
            const email = req.params.email
            const query = {EmployeeEmail: email}
            const result = await EmployeesCollection.findOne(query)
            res.send(result)
        })

        app.put('/employeesInfo', async(req, res) => {
            const info = req.body;
            console.log(info);
            const filter = {EmployeeEmail: info?.userName.email}
            const updatedDoc = {
                $set: {
                    EmployeeName: info?.userName.name
                }
            }
            const result = await EmployeesCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })

        app.post('/requestForAsset',async(req,res)=>{
            const result = await requestForAssetCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/requestForAsset',async(req,res)=>{
            const result = await requestForAssetCollection.find().toArray()
            res.send(result)
        })

        app.post('/customRequest', async(req,res)=>{
            const result = await customRequestCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/customRequest', async(req,res)=>{
            const result = await customRequestCollection.find().toArray()
            res.send(result)
        })

        app.patch('/customRequest/:id', async(req,res)=>{
            const id = req.params.id
            const filter = {_id : new ObjectId(id)}
            const updatedDoc = {
                $set: {
                    requestStatus: 'approved',
                    approvedDate: new Date().toLocaleDateString()
                }
            }
            const result = await customRequestCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })
        app.patch('/customRequest', async(req,res)=>{
            const name = req.body
            console.log(name.name);
            const filter = {assetName : name.name}
            const updatedDoc = {
                $set: {
                    requestStatus: "returned"
                }
            }
            const result = await customRequestCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })

        app.delete('/customRequest/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const result = await customRequestCollection.deleteOne(query)
            res.send(result)
        })

        // admin info

        app.post('/adminInfo',async(req,res)=>{
            const result = await adminCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/adminInfo/:email',async(req,res)=>{
            const email = req.params.email
            const query = {adminEmail: email}
            const result = await adminCollection.findOne(query)
            res.send(result)
        })

        app.get('/adminInfo', async(req,res)=>{
            const result = await adminCollection.find().toArray()
            res.send(result)
        })

        app.put('/adminInfo', async(req, res) => {
            const info = req.body;
            console.log(info);
            const filter = {adminEmail: info?.userName?.email}
            const updatedDoc = {
                $set: {
                    adminName: info?.userName?.name
                }
            }
            const result = await adminCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })

        app.put('/adminInfo', async (req, res) => {
            const info = req.body;
            console.log(info);
            const filter = {adminEmail: info?.email}
            const updatedDoc = {
                $set: {
                    limit: info?.member
                }
            }
            const result = await adminCollection.updateOne(filter, updatedDoc)
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

        app.get('/packages/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await packagesCollection.findOne(query)
            res.send(result)
        })

        app.get('/packages/:name',async(req,res)=>{
            const name = req.params.name
            const query = {name: name}
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
        
        app.post('/payments',async (req,res)=>{
            const result = await paymentsCollection.insertOne(req.body)
            res.send(result)
        })

        // assets made by admin

        app.post('/assetsInfo', async(req,res)=>{
            const result = await assetsInfoCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/assetsInfo',async(req,res)=>{
            const result = await assetsInfoCollection.find().toArray()
            res.send(result)
        })

        app.delete('/assetsInfo/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const result = await assetsInfoCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/assetUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedInfo = req.body;
            const info = {
                $set: {
                    assetName: updatedInfo.assetName,
                    assetType: updatedInfo.assetType,
                    assetQuantity: updatedInfo.assetQuantity,
                    assetStatus: updatedInfo.assetStatus,
                    date: updatedInfo.date
                }
            }
            const result = await assetsInfoCollection.updateOne(filter, info, options);
            res.send(result);
        })

        app.get('/assetUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await assetsInfoCollection.findOne(query);
            res.send(result);
        })

        app.get('/assetUpdate',async(req, res)=>{
            const result = await assetsInfoCollection.find().toArray()
            res.send(result)
        })

        app.post('/team',async(req,res)=>{
            const result = await teamCollection.insertOne(req.body)
            res.send(result)
        })

        app.post('/user',async(req,res)=>{
            const result = await userCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/user',async(req,res)=>{
            const result = await userCollection.find().toArray()
            res.send(result)
        })


        app.get('/team',async(req,res)=>{
            const result = await teamCollection.find().toArray()
            res.send(result)
        })

        app.delete('/user/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
