const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secretToken = authHeader.split(' ')[1];
    // console.log(secretToken)
    next();
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvrai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const toolCollection = client.db('sks-inc').collection('tools');
        const userCollection = client.db('sks-inc').collection('users');
        const orderCollection = client.db('sks-inc').collection('orders');

        //add orders to database
        app.put('/order', async (req, res) => {
            const order = req.body;
            const { email, orderQty, toolName, date } = order;
            const filter = { email, orderQty, toolName, date };
            const option = { upsert: true };
            const updatedOrder = {
                $set: order
            };
            const result = await orderCollection.updateOne(filter, updatedOrder, option);
            res.send(result);
        });

        //load order by email or my order API
        app.get('/my-order/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const myOrder = await orderCollection.find(query).toArray();
            res.send(myOrder);
        })

        //load tools at most 6 item
        app.get('/tools', async (req, res) => {
            const tools = await toolCollection.find().limit(6).toArray();
            res.send(tools);
        });

        //load tool by id
        app.get('/tool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        })

        //create/update user or add user information to database
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            // console.log(email, user)
            const filter = { email: email };
            const option = { upsert: true };
            const updatedUser = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updatedUser, option);
            const secretToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ result, secretToken });
        });

    }
    finally {

    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SKS Inc. Server is Running');
});

app.listen(port, () => {
    console.log('SKS Inc. Server is Listening fron port: ', port);
})