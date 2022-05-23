const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

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

        app.get('/tools', async (req, res) => {
            const tools = await toolCollection.find().toArray();
            res.send(tools);
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