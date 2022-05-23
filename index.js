const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

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

        app.get('/tools', async (req, res) => {
            const tools = await toolCollection.find().limit(6).toArray();
            res.send(tools);
        });

        //create/update user or add user information to database
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            console.log(email, user)
            const filter = { email: email };
            const option = { upsert: true };
            const updatedUser = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updatedUser, option);
            const secretToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ result, secretToken });
        })

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