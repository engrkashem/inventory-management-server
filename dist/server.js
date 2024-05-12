"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { use } = require('express/lib/application');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvrai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const toolCollection = client.db('sks-inc').collection('tools');
        const userCollection = client.db('sks-inc').collection('users');
        const orderCollection = client.db('sks-inc').collection('orders');
        const paymentCollection = client.db('sks-inc').collection('payments');
        const reviewCollection = client.db('sks-inc').collection('reviews');
        //verify admin middletire
        const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const requester = req.decoded.email;
            const requesterInfo = yield userCollection.findOne({ email: requester });
            if (requesterInfo.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'Forbidden' });
            }
        });
        //Stripe payment intent APIs
        app.post('/create-payment-intent', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { price } = req.body;
            const amount = parseFloat(price) * 100;
            const paymentIntent = yield stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card'],
            });
            res.send({
                clientSecret: paymentIntent.client_secret
            });
        }));
        //Load reviews from database
        app.get('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield reviewCollection.find().toArray();
            res.send(result);
        }));
        //add review to database
        app.post('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const review = req.body;
            const result = yield reviewCollection.insertOne(review);
            res.send(result);
        }));
        //add orders to database
        app.put('/order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const order = req.body;
            const { email, orderQty, toolName, date } = order;
            const filter = { email, orderQty, toolName, date };
            const option = { upsert: true };
            const updatedOrder = {
                $set: order
            };
            const result = yield orderCollection.updateOne(filter, updatedOrder, option);
            res.send(result);
        }));
        //update order and available stock also insert payment history
        app.patch('/order/:id', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const updatedTool = yield toolCollection.updateOne(toolFilter, updatedToolInfo);
            const paymentData = yield paymentCollection.insertOne(payment);
            const result = yield orderCollection.updateOne(orderFilter, updatedOrder);
            res.send(result);
        }));
        //cancel or delete order
        app.delete('/order/:id', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = yield orderCollection.deleteOne(query);
            res.send(result);
        }));
        //Load all order from database
        app.get('/order', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const orders = yield orderCollection.find().toArray();
            res.send(orders);
        }));
        //load order by email or my order API
        app.get('/my-order/:email', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const email = req.params.email;
            const query = { email };
            const myOrder = yield orderCollection.find(query).toArray();
            res.send(myOrder);
        }));
        //update order to shipped by email
        app.put('/order/:id', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: { shipped: true }
            };
            const result = yield orderCollection.updateOne(filter, updatedDoc);
            res.send(result);
        }));
        //load tools  item
        app.get('/tools', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const tools = yield toolCollection.find().toArray();
            res.send(tools);
        }));
        //load tool by id
        app.get('/tool/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = yield toolCollection.findOne(query);
            res.send(tool);
        }));
        //add a tool/product to database
        app.post('/tool', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const tool = req.body;
            const result = yield toolCollection.insertOne(tool);
            res.send(result);
        }));
        //Delete a tool or product
        app.delete('/tool/:id', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const toolId = req.params.id;
            const query = { _id: ObjectId(toolId) };
            const result = yield toolCollection.deleteOne(query);
            res.send(result);
        }));
        //check admin to protect admin route
        app.get('/admin/:email', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const email = req.params.email;
            const user = yield userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin });
        }));
        //load user profile by email
        app.get('/user/:email', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const email = req.params.email;
            const query = { email: email };
            const result = yield userCollection.findOne(query);
            res.send(result);
        }));
        //load all user
        app.get('/user', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield userCollection.find().toArray();
            res.send(result);
        }));
        //make a user admin
        app.patch('/user/admin/:email', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.params.email;
            const filter = { email: user };
            const updatedDoc = {
                $set: { role: 'admin' }
            };
            const result = yield userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        }));
        //remove admin
        app.put('/user/admin/:email', verifyToken, verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.params.email;
            const filter = { email: user };
            const updatedDoc = {
                $set: { role: ' ' }
            };
            const result = yield userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        }));
        //Update user profile
        app.patch('/user/:email', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const email = req.params.email;
            const userInfo = req.body;
            const filter = { email: email };
            const updatedDoc = {
                $set: userInfo
            };
            const result = yield userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        }));
        //create/update user or add user information to database
        app.put('/user/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const email = req.params.email;
            const user = req.body;
            // console.log(email, user)
            const filter = { email: email };
            const option = { upsert: true };
            const updatedUser = {
                $set: user
            };
            const result = yield userCollection.updateOne(filter, updatedUser, option);
            const secretToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ result, secretToken });
        }));
    }
    finally {
    }
});
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('SKS Inc. Server is Running');
});
app.listen(port, () => {
    console.log('SKS Inc. Server is Listening fron port: ', port);
});
