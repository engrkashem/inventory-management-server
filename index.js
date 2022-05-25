const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { use } = require('express/lib/application');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const secretToken = authHeader.split(' ')[1];

    jwt.verify(secretToken, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' });
        }
        req.decoded = decoded;
        next(); //to go further / read rest code after calling function.
    });
};

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
        const paymentCollection = client.db('sks-inc').collection('payments');
        const reviewCollection = client.db('sks-inc').collection('reviews');

        //Stripe payment intent APIs
        app.post('/create-payment-intent', verifyToken, async (req, res) => {
            const { price } = req.body;
            const amount = parseFloat(price) * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card'],
            });
            res.send({
                clientSecret: paymentIntent.client_secret
            });
        });

        //Load reviews from database
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        });

        //add review to database
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

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

        //update order and available stock also insert payment history
        app.patch('/order/:id', verifyToken, async (req, res) => {
            const orderID = req.params.id;
            const { payment, myOrder } = req.body;
            const orderFilter = { _id: ObjectId(orderID) };
            const updatedOrder = {
                $set: {
                    paid: true,
                    txId: payment.txId
                }
            };
            const orderQty = myOrder.orderQty;
            const stockQty = myOrder.stockQty;
            const newQty = parseInt(stockQty) - parseInt(orderQty);
            const toolID = myOrder.productId;
            const toolFilter = { _id: ObjectId(toolID) };
            const updatedToolInfo = {
                $set: {
                    quantity: newQty
                }
            };
            const updatedTool = await toolCollection.updateOne(toolFilter, updatedToolInfo);
            const paymentData = await paymentCollection.insertOne(payment);
            const result = await orderCollection.updateOne(orderFilter, updatedOrder);
            res.send(result);

        });

        //cancel or delete order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        //load order by email or my order API
        app.get('/my-order/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const myOrder = await orderCollection.find(query).toArray();
            res.send(myOrder);
        })

        //load tools  item
        app.get('/tools', async (req, res) => {
            const tools = await toolCollection.find().toArray();
            res.send(tools);
        });

        //load tool by id
        app.get('/tool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        });

        //add a tool/product to database
        app.post('/tool', verifyToken, async (req, res) => {
            const tool = req.body;
            const result = await toolCollection.insertOne(tool);
            res.send(result);
        });

        //check admin to protect admin route
        app.get('/admin/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin });
        });

        //load user profile by email
        app.get('/user/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        //load all user
        app.get('/user', verifyToken, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        //make a user admin
        app.patch('/user/admin/:email', verifyToken, async (req, res) => {
            const user = req.params.email;
            const requester = req.decoded.email;
            const requesterInfo = await userCollection.findOne({ email: requester });
            if (requesterInfo.role === 'admin') {
                const filter = { email: user };
                const updatedDoc = {
                    $set: { role: 'admin' }
                };
                const result = await userCollection.updateOne(filter, updatedDoc);
                res.send(result);
            }
            else {
                res.status(403).send({ message: 'Forbidden' });
            }

        });

        //Update user profile
        app.patch('/user/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const userInfo = req.body;
            const filter = { email: email };
            const updatedDoc = {
                $set: userInfo
            };
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
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